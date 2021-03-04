// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js')
// eslint-disable-next-line no-unused-vars
const { Document } = require('mongoose')
const ms = require('ms')
const { ThemesMoeAPI } = require('../rest/ThemesMoeAPI')

/**
 * Round Configuration Handler
 */
module.exports.MatchConfig = class MatchConfig {
  /**
   * Constructor
   * @param {Message} message
   * @param {Document} guild
   * TODO: t param
   */
  constructor(message, guild, t) {
    this.message = message
    this.guild = guild
    this.t = t
  }

  async startCollector() {
    return await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .then(async (c) => {
        const m = c.first()
        if (m.content === `${this.guild.prefix}stop`) {
          this.message.channel.send(
            this.t('commands:start.roundConfig.cancelledMatch')
          )
          this.guild.rolling = false
          await this.guild.save()
          return false
        }
        return m
      })
      .catch(async () => {
        this.guild.rolling = false
        await this.guild.save()
        throw new Error(this.t('commands:start.roundConfig.expiredMatch'))
      })
  }

  /**
   * Get the round gamemode (easy, normal, hard, list, event)
   */
  async getGamemode() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatMode', {
        modes: '(easy, normal, hard, list, season)',
      })
    )
    const mode = await this.startCollector().then(async (m) => {
      if (!m) return
      const specifiedMode = m.content.toLowerCase()
      if (
        specifiedMode === 'easy' ||
        specifiedMode === 'normal' ||
        specifiedMode === 'hard' ||
        specifiedMode === 'list' ||
        specifiedMode === 'season'
      ) {
        await primary.delete()
        await m.delete()
        return specifiedMode
      } else {
        throw new Error(this.t('commands:start.roundConfig.invalidMode'))
      }
    })
    return mode
  }

  /**
   * Get the number of rounds of the match.
   */
  async getRounds() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatRounds')
    )
    const rounds = await this.startCollector().then(async (m) => {
      if (!m) return
      const int = parseInt(m.content)
      if (isNaN(int))
        return this.message.channel.send(
          this.t('commands:start.roundConfig.isNaN')
        )
      if (int > 10)
        throw new Error(this.t('commands:start.roundConfig.roundsLimit'))
      await primary.delete()
      await m.delete()
      return int
    })
    return rounds
  }

  /**
   * Get the duration of all the rounds.
   */
  async getDuration() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatDuration')
    )
    const duration = await this.startCollector().then(async (m) => {
      if (!m) return
      if (m.content.endsWith('s')) {
        const milliseconds = ms(m.content)
        const long = ms(milliseconds, { long: true })
        if (milliseconds < 20000)
          return this.message.channel.send(
            this.t('commands:start.roundConfig.minimumTime')
          )
        await primary.delete()
        await m.delete()
        return { parsed: milliseconds, value: long }
      } else {
        throw new Error(this.t('commands:start.roundConfig.invalidDuration'))
      }
    })
    return duration
  }

  /**
   * Get the List Service (MyAnimeList, Anilist)
   */
  async getListService() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatAnimeListWebsite', {
        websites: 'MyAnimeList, AniList',
      })
    )
    const service = await this.startCollector().then(async (m) => {
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
        throw new Error(this.t('commands:start.roundConfig.invalidWebsite'))
      }
    })
    return service
  }

  /**
   * Get Animelist Username
   * @param {String} service - Website
   */
  async getListUsername(service) {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatUsername')
    )
    const username = await this.startCollector().then(async (m) => {
      if (!m) return
      const themesMoe = new ThemesMoeAPI()
      let user
      try {
        if (service === 'mal') {
          user = await themesMoe.getAnimesByMal(m.content)
        } else if (service === 'anilist') {
          user = await themesMoe.getAnimesByAnilist(m.content)
        }
      } catch (e) {
        return this.message.channel.send(
          this.t('game:errors.fatalError', { error: `\`${e}\`` })
        )
      }

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
        throw new Error(this.t('commands:start.roundConfig.invalidUsername'))
      }
    })
    return username
  }

  async getSeason() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatYearAndSeason')
    )
    const season = await this.startCollector().then(async (m) => {
      if (!m) return
      const themesMoe = new ThemesMoeAPI()
      const season = m.content.split(',')
      if (season[0] && season[1]) {
        const themes = await themesMoe.getAnimesPerSeason(season[0])
        if (!themes)
          return this.message.channel.send(
            this.t('commands:start.roundConfig.noAnimeFound')
          )
        await primary.delete()
        await m.delete()
        return {
          year: season[0],
          season: season[1].trim().toLowerCase(),
        }
      } else {
        throw new Error(this.t('commands:start.roundConfig.invalidFormat'))
      }
    })
    return season
  }
}
