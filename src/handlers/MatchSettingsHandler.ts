import ms from 'ms'
import RitsuClient from '@structures/RitsuClient'
import ThemesMoe from '@utils/ThemesMoe'
import { TFunction } from 'i18next'
import { Message } from 'eris'
import { GuildDocument } from '@entities/Guild'
import UserService from '@services/UserService'
import InvalidMatchConfig from '@structures/errors/InvalidMatchConfig'

/**
 * Match Settings Handler
 * @description Handle all the match questions (when you use ritsu!start without any argument)
 */
export default class MatchSettingsHandler {
  public userService: UserService = new UserService()

  constructor(
    private client: RitsuClient,

    private message: Message,
    private guild: GuildDocument,
    private locales: TFunction
  ) {
    this.message = message
    this.client = client
    this.guild = guild
    this.locales = locales
  }

  async startCollector(): Promise<Message> {
    return await this.message.channel
      .awaitMessages((m: Message) => m.author.id === this.message.author.id, {
        time: 60000,
        maxMatches: 1,
      })
      .then((messages) => {
        if (!messages.length) {
          throw new Error(
            this.locales('gameQuestions:errors.expiredMatch', {
              command: `${this.guild.prefix}start`,
            })
          )
        }

        const message = messages[0]
        if (message.content === `${this.guild.prefix}stop`) {
          void this.message.channel.createMessage(
            this.locales('gameQuestions:errors.matchStopped', {
              command: `${this.guild.prefix}start`,
            })
          )
          return
        }
        return message
      })
  }

  async getMatchSettings() {
    const gamemode = await this.getGamemode()
    const rounds = await this.getRounds()
    const duration = await this.getDuration()
    const themeType = await this.getThemesType()

    let animeListWebsite: string
    let animeListUsername: string
    let season: string
    let seasonYear: string

    if (gamemode === 'list') {
      animeListWebsite = await this.getListWebsite()
      animeListUsername = await this.getListUsername(animeListWebsite)
    } else if (gamemode === 'season') {
      const seasonObject = await this.getSeason()

      season = seasonObject.season
      seasonYear = seasonObject.year
    }

    return {
      gamemode,
      rounds,
      duration,
      themeType,
      animeListWebsite,
      animeListUsername,
      season,
      seasonYear,
    }
  }

  async getGamemode(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatMode', {
        modes: `(${this.client.enabledGamemodes
          .map((gamemode) => gamemode)
          .join(', ')})`,
      })
    )
    const mode = await this.startCollector().then(async (message) => {
      const specifiedMode = message.content.toLowerCase()
      if (this.client.enabledGamemodes.includes(specifiedMode)) {
        await primary.delete()
        await message.delete()
        return specifiedMode
      } else {
        throw new InvalidMatchConfig(
          `Oopsie! I can't recognize this gamemode! Valid Gamemodes: \`${this.client.enabledGamemodes
            .map((gamemode) => gamemode)
            .join(', ')}\``,
          'easy'
        )
      }
    })
    return mode
  }

  async getRounds(): Promise<number> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatNumberOfRounds')
    )
    const user = await this.userService.getUser(this.message.author.id)

    const rounds = await this.startCollector().then(async (message) => {
      const rounds = parseInt(message.content.toLowerCase())

      if (isNaN(rounds))
        throw new InvalidMatchConfig(
          this.locales('gameQuestions:errors.isNaN'),
          '10'
        )
      if (rounds > 15 && !user.patreonSupporter)
        throw new InvalidMatchConfig(
          this.locales('gameQuestions:errors.roundsLimit', {
            rounds: 15,
          }),
          '10'
        )

      await message.delete()
      await primary.delete()
      return rounds
    })
    return rounds
  }

  async getDuration(): Promise<{ parsed: number; value: string }> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatDuration')
    )
    const duration = await this.startCollector().then(async (message) => {
      if (message.content.endsWith('s')) {
        const milliseconds = ms(message.content)
        const long = ms(milliseconds, { long: true })
        if (milliseconds < 20000)
          throw new InvalidMatchConfig(
            this.locales('gameQuestions:errors.minimiumDuration'),
            '20 seconds'
          )
        await primary.delete()
        await message.delete()
        return { parsed: milliseconds, value: long }
      } else {
        throw new InvalidMatchConfig(
          this.locales('gameQuestions:errors.invalidDuration'),
          '20 seconds'
        )
      }
    })
    return duration
  }

  async getThemesType(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatThemeType')
    )

    const themeType = await this.startCollector().then(async (message) => {
      const themeType = message.content.toLowerCase()
      if (
        themeType === 'openings' ||
        themeType === 'endings' ||
        themeType === 'both'
      ) {
        await primary.delete()
        await message.delete()
        return themeType
      }

      throw new InvalidMatchConfig(
        this.locales('gameQuestions:errors.invalidThemeType', {
          types: '**openings, endings, both**',
        }),
        'both'
      )
    })

    return themeType
  }

  async getListWebsite(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatAnimeListWebsite', {
        websites: '`myanimelist, anilist`',
      })
    )
    const website = await this.startCollector().then(async (message) => {
      if (
        message.content.toLowerCase() === 'myanimelist' ||
        message.content.toLowerCase() === 'anilist'
      ) {
        await primary.delete()
        await message.delete()

        if (message.content.toLowerCase() === 'myanimelist') return 'mal'

        return message.content.toLowerCase()
      } else {
        throw new InvalidMatchConfig(
          this.locales('gameQuestions:errors.invalidWebsite'),
          'anilist'
        )
      }
    })
    return website
  }

  async getListUsername(website: string): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatUsername')
    )
    const username = await this.startCollector().then(async (message) => {
      try {
        const user = await ThemesMoe.getAnimesByAnimeList(
          website,
          message.content
        )

        if (user.length <= 10) {
          throw new InvalidMatchConfig(
            this.locales('gameQuestions:errors.unsufficientAnimes'),
            'None'
          )
        }

        if (user) {
          await primary.delete()
          await message.delete()
          return message.content
        } else {
          throw new InvalidMatchConfig(
            this.locales('gameQuestions:errors.invalidUsername'),
            'FelipeSazz'
          )
        }
      } catch (e) {
        throw new Error(`${e}`)
      }
    })
    return username
  }

  async getSeason(): Promise<{ year: string; season: string }> {
    const primary = await this.message.channel.createMessage(
      this.locales('gameQuestions:whatYearAndSeason')
    )

    const season = await this.startCollector().then(async (message) => {
      const seasonFormat = message.content.split(',')
      const year = seasonFormat[0]
      const season = seasonFormat[1]

      if (year && season) {
        await primary.delete()
        await message.delete()
        return {
          year: year,
          season: season.trim().toLowerCase(),
        }
      } else {
        throw new InvalidMatchConfig(
          this.locales('gameQuestions:errors.invalidFormat'),
          '2020, Winter'
        )
      }
    })
    return season
  }
}
