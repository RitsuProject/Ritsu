import { Guild, Message } from 'eris'
import ms from 'ms'
import RitsuClient from '../structures/RitsuClient'
import ThemesMoe from '../utils/ThemesMoe'

/**
 * Match Settings Handler
 * @description The waifu of the match settings (number of rounds, game mode, etc.)
 */
export default class MatchSettingsHandler {
  private client: RitsuClient
  private message: Message
  private guild: Guild
  constructor(message: Message, client: RitsuClient) {
    this.message = message
    this.client = client
  }

  async startCollector(): Promise<Message> {
    return await this.message.channel
      .awaitMessages((m: Message) => m.author.id === this.message.author.id, {
        time: 10000,
        maxMatches: 1,
      })
      .then((messages) => {
        if (!messages.length) {
          throw new Error('Expired Match')
        }

        const m = messages[0]
        if (m.content === `mugi!stop`) {
          this.message.channel.createMessage('Match cancelled.')
          return
        }

        return m
      })
  }

  async getGamemode(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      'What game mode do you want for the match?'
    )
    const mode = await this.startCollector().then(async (m) => {
      if (!m) return

      const specifiedMode = m.content.toLowerCase()
      if (this.client.enabledGamemodes.includes(specifiedMode)) {
        await primary.delete()
        await m.delete()
        return specifiedMode
      } else {
        throw new Error('Invalid Game Mode.')
      }
    })
    return mode
  }

  async getRounds(): Promise<number> {
    const primary = await this.message.channel.createMessage(
      'How many rounds in the match do you want?'
    )

    const rounds = await this.startCollector().then(async (m) => {
      if (!m) return

      const rounds = parseInt(m.content.toLowerCase())

      if (isNaN(rounds))
        throw new Error("Well...it doesn't seem like a number, I think.")
      if (rounds > 10)
        throw new Error(
          'For extremely boring reasons, you cannot start more than 10 rounds as a normal user, if you want more, you can help me with my Patreon!'
        )

      await m.delete()
      await primary.delete()
      return rounds
    })
    return rounds
  }

  async getDuration(): Promise<{ parsed: number; value: string }> {
    const primary = await this.message.channel.createMessage(
      'each rounds duration'
    )
    const duration = await this.startCollector().then(async (m) => {
      if (!m) return
      if (m.content.endsWith('s')) {
        const miliseconds = ms(m.content)
        const long = ms(miliseconds, { long: true })
        if (miliseconds < 20000) throw new Error('minimium time limit')
        await primary.delete()
        await m.delete()
        return { parsed: miliseconds, value: long }
      } else {
        throw new Error('invalid')
      }
    })
    return duration
  }

  async getListWebsite(): Promise<string> {
    const primary = await this.message.channel.createMessage(
      'What website is your animelist on? (Supported: MyAnimeList, Anilist)'
    )
    const website = await this.startCollector().then(async (m) => {
      if (!m) return
      if (
        m.content.toLowerCase() === 'myanimelist' ||
        m.content.toLowerCase() === 'anilist'
      ) {
        await primary.delete()
        await m.delete()

        if (m.content.toLowerCase() === 'myanimelist') return 'mal'

        return m.content.toLowerCase()
      } else {
        throw new Error(
          'This does not appear to be a supported website. Canceling...'
        )
      }
    })
    return website
  }

  async getListUsername(website: string): Promise<string> {
    const primary = await this.message.channel.createMessage(
      'What is your username on your chosen website?'
    )
    const username = await this.startCollector().then(async (m) => {
      if (!m) return

      try {
        const user = await ThemesMoe.getAnimesByAnimeList(website, m.content)

        if (user.length <= 10) {
          throw new Error(
            'You need at least 10 animes in list to use this gamemode.'
          )
        }

        if (user) {
          await primary.delete()
          await m.delete()
          return m.content
        } else {
          throw new Error('Invalid Username')
        }
      } catch (e) {
        throw new Error(e.message)
      }
    })
    return username
  }

  async getSeason(): Promise<{ year: string; season: string }> {
    const primary = await this.message.channel.createMessage(
      'What is the year and season? (Example: 2021, Winter)'
    )

    const season = await this.startCollector().then(async (m) => {
      if (!m) return
      const seasonFormat = m.content.split(',')
      const year = seasonFormat[0]
      const season = seasonFormat[1]

      if (year && season) {
        await primary.delete()
        await m.delete()
        return {
          year: year,
          season: season.trim().toLowerCase(),
        }
      } else {
        throw new Error('This does not seem to be in the right format.')
      }
    })
    return season
  }
}
