const { Message } = require('discord.js')
const { Document } = require('mongoose')
const { default: parse } = require('parse-duration')
const { ThemesMoeService } = require('../services/ThemesMoeService')

/**
 * Round Configuration Handler
 */
module.exports.RoundConfigHandler = class RoundConfigHandler {
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

  /**
   * Get the round gamemode (easy, normal, hard, list, event)
   */
  async getGamemode() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatMode', {
        modes: '(easy, normal, hard, list, event)',
      })
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.expiredMatch')
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.cancelledMatch')
      )
    if (
      m.content.toLowerCase() === 'easy' ||
      m.content.toLowerCase() === 'normal' ||
      m.content.toLowerCase() === 'hard' ||
      m.content.toLowerCase() === 'list' ||
      m.content.toLowerCase() === 'event'
    ) {
      await primary.delete()
      await m.delete().catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.noManageMessagesPermission', {
            MANAGE_MESSAGES: this.t('permissions:MANAGE_MESSAGES'),
          })
        )
      })
      return m.content.toLowerCase()
    } else {
      return this.message.channel.send(
        this.t('commands:start.roundConfig.invalidMode')
      )
    }
  }
  /**
   * Get the number of rounds of the match.
   */
  async getRounds() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatRounds')
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.expiredMatch')
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.cancelledMatch')
      )
    const int = parseInt(m.content)
    if (isNaN(int))
      return this.message.channel.send(
        this.t('commands:start.roundConfig.isNaN')
      )
    if (int > 10)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.roundsLimit')
      )
    await primary.delete()
    await m.delete()
    return int
  }
  /**
   * Get the duration of all the rounds.
   */
  async getDuration() {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatDuration')
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.expiredMatch')
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.cancelledMatch')
      )
    if (m.content.endsWith('s')) {
      const parsed = parse(m.content)
      if (parsed < 20000)
        return this.message.channel.send(
          this.t('commands:start.roundConfig.minimiumTime')
        )
      await primary.delete()
      await m.delete()
      return { parsed: parsed, value: m.content }
    } else {
      return this.message.channel.send(
        this.t('commands:start.roundConfig.invalidDuration')
      )
    }
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
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.expiredMatch')
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.cancelledMatch')
      )
    if (
      m.content.toLowerCase() === 'myanimelist' ||
      m.content.toLowerCase() === 'anilist'
    ) {
      await primary.delete()
      await m.delete()
      if (m.content.toLowerCase() === 'myanimelist') return 'mal'
      return m.content.toLowerCase()
    } else {
      return this.message.channel.send(
        this.t('commands:start.roundConfig.invalidWebsite')
      )
    }
  }
  /**
   * Get Animelist Username
   * @param {String} service - Website
   */
  async getListUsername(service) {
    const primary = await this.message.channel.send(
      this.t('commands:start.roundConfig.whatUsername')
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          this.t('commands:start.roundConfig.expiredMatch')
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send(
        this.t('commands:start.roundConfig.cancelledMatch')
      )
    const themesMoe = new ThemesMoeService()
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

    if (user) {
      await primary.delete()
      await m.delete()
      return m.content
    } else {
      return this.message.channel.send(
        this.t('commands:start.roundConfig.invalidUsername')
      )
    }
  }
}
