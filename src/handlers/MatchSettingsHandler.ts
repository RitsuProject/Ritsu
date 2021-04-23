import ms from 'ms'
import RitsuClient from '@structures/RitsuClient'
import ThemesMoe from '@utils/ThemesMoe'
import { TFunction } from 'i18next'
import { Message } from 'eris'
import { GuildDocument } from '@entities/Guild'
import User from '@entities/User'

/**
 * Match Settings Handler
 * @description Handle all the match questions (when you use ritsu!start without any argument)
 */
export default class MatchSettingsHandler {
  constructor(
    private message: Message,
    private client: RitsuClient,
    private guild: GuildDocument,
    private t: TFunction
  ) {
    this.message = message
    this.client = client
    this.guild = guild
    this.t = t
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
            this.t('gameQuestions:errors.expiredMatch', {
              command: `${this.guild.prefix}start`,
            })
          )
        }

        const message = messages[0]
        if (message.content === `${this.guild.prefix}stop`) {
          void this.message.channel.createMessage(
            this.t('gameQuestions:errors.matchStopped', {
              command: `${this.guild.prefix}start`,
            })
          )
          return
        }
        return message
      })
  }

  async getGamemode(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatMode', {
        modes: `(${this.client.enabledGamemodes
          .map((gamemode) => gamemode)
          .join(', ')})`,
      })
    )
    const mode = await this.startCollector().then(async (message) => {
      if (!message) return

      const specifiedMode = message.content.toLowerCase()
      if (this.client.enabledGamemodes.includes(specifiedMode)) {
        await primary.delete()
        await message.delete()
        return specifiedMode
      } else {
        throw new Error(this.t('gameQuestions:errors.invalidMode'))
      }
    })
    return mode
  }

  async getRounds(): Promise<number> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatNumberOfRounds')
    )
    const user = await User.findById(this.message.author.id)

    const rounds = await this.startCollector().then(async (message) => {
      if (!message) return

      const rounds = parseInt(message.content.toLowerCase())

      if (isNaN(rounds)) throw new Error(this.t('gameQuestions:errors.isNaN'))
      if (rounds > 10 && !user.patreonSupporter)
        throw new Error(this.t('gameQuestions:errors.roundsLimit'))

      await message.delete()
      await primary.delete()
      return rounds
    })
    return rounds
  }

  async getDuration(): Promise<{ parsed: number; value: string }> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatDuration')
    )
    const duration = await this.startCollector().then(async (message) => {
      if (!message) return
      if (message.content.endsWith('s')) {
        const milliseconds = ms(message.content)
        const long = ms(milliseconds, { long: true })
        if (milliseconds < 20000)
          throw new Error(this.t('gameQuestions:errors.minimiumDuration'))
        await primary.delete()
        await message.delete()
        return { parsed: milliseconds, value: long }
      } else {
        throw new Error(this.t('gameQuestions:errors.invalidDuration'))
      }
    })
    return duration
  }

  async getListWebsite(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatAnimeListWebsite')
    )
    const website = await this.startCollector().then(async (message) => {
      if (!message) return
      if (
        message.content.toLowerCase() === 'myanimelist' ||
        message.content.toLowerCase() === 'anilist'
      ) {
        await primary.delete()
        await message.delete()

        if (message.content.toLowerCase() === 'myanimelist') return 'mal'

        return message.content.toLowerCase()
      } else {
        throw new Error(this.t('gameQuestions:errors.invalidWebsite'))
      }
    })
    return website
  }

  async getListUsername(website: string): Promise<string> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatUsername')
    )
    const username = await this.startCollector().then(async (message) => {
      if (!message) return

      try {
        const user = await ThemesMoe.getAnimesByAnimeList(
          website,
          message.content
        )

        if (user.length <= 10) {
          throw new Error(this.t('gameQuestions:errors.unsufficientAnimes'))
        }

        if (user) {
          await primary.delete()
          await message.delete()
          return message.content
        } else {
          throw new Error(this.t('gameQuestions:errors.invalidUsername'))
        }
      } catch (e) {
        throw new Error(`${e}`)
      }
    })
    return username
  }

  async getSeason(): Promise<{ year: string; season: string }> {
    const primary = await this.message.channel.createMessage(
      this.t('gameQuestions:whatYearAndSeason')
    )

    const season = await this.startCollector().then(async (message) => {
      if (!message) return
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
        throw new Error(this.t('gameQuestions:errors.invalidFormat'))
      }
    })
    return season
  }
}
