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
   */
  constructor(message, guild) {
    this.message = message
    this.guild = guild
  }

  /**
   * Get the round gamemode (easy, normal, hard)
   */
  async getGamemode() {
    this.message.channel.send(
      'What mode do you want to play? (easy, normal, hard, list)'
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          'The game has expired, please start it again.'
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send('Match cancelled.')
    if (
      m.content.toLowerCase() === 'easy' ||
      m.content.toLowerCase() === 'normal' ||
      m.content.toLowerCase() === 'hard' ||
      m.content.toLowerCase() === 'list'
    ) {
      return m.content.toLowerCase()
    } else {
      return this.message.channel.send(
        'This does not seem like a valid difficulty. Canceling...'
      )
    }
  }
  /**
   * Get the number of rounds of the match.
   */
  async getRounds() {
    this.message.channel.send('What is the number of rounds of the match?')
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          'The game has expired, please start it again.'
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send('Match cancelled.')
    const int = parseInt(m.content)
    if (isNaN(int))
      return this.message.channel.send(
        "That doesn't look like a number! Canceling..."
      )
    if (int > 10)
      return this.message.channel.send(
        'You can only start up to 10 rounds! Canceling...'
      )
    return int
  }
  /**
   * Get the duration of all the rounds.
   */
  async getDuration() {
    this.message.channel.send(
      'What is the duration for the rounds? (Minimum: 20 seconds)'
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          'The game has expired, please start it again.'
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send('Match cancelled.')
    if (m.content.endsWith('s')) {
      const parsed = parse(m.content)
      if (parsed < 20000)
        return this.message.channel.send(
          'The minimum time is 20 seconds! Please enter a higher value. Canceling...'
        )
      return { parsed: parsed, value: m.content }
    } else {
      return this.message.channel.send(
        'This does not seem to be a valid duration. Canceling...'
      )
    }
  }
  /**
   * Get the List Service (MyAnimeList, Anilist)
   */
  async getListService() {
    this.message.channel.send(
      'What website is your animelist on? (Supported: MyAnimeList, Anilist)'
    )
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          'The game has expired, please start it again.'
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send('Match cancelled.')
    if (
      m.content.toLowerCase() === 'myanimelist' ||
      m.content.toLowerCase() === 'anilist'
    ) {
      if (m.content.toLowerCase() === 'myanimelist') return 'mal'
      return m.content.toLowerCase()
    } else {
      return this.message.channel.send(
        'This does not appear to be a supported website. Canceling...'
      )
    }
  }
  /**
   * Get Animelist Username
   * @param {String} service - Website
   */
  async getListUsername(service) {
    this.message.channel.send('What is your username on your chosen website?')
    const collector = await this.message.channel
      .awaitMessages((m) => m.author.id === this.message.author.id, {
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        return this.message.channel.send(
          'The game has expired, please start it again.'
        )
      })
    const m = collector.first()
    if (m.content === `${this.guild.prefix}stop`)
      return this.message.channel.send('Match cancelled.')
    const themesMoe = new ThemesMoeService()
    let user
    if (service === 'mal') {
      user = await themesMoe.getAnimesByMal(m.content)
    } else if (service === 'anilist') {
      user = await themesMoe.getAnimesByAnilist(m.content)
    }

    if (user) {
      return m.content
    } else {
      return this.message.channel.send(
        "I didn't find this username on the website you chose! Canceling..."
      )
    }
  }
}
