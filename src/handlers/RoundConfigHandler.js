const { Message } = require('discord.js')
const { default: parse } = require('parse-duration')

/**
 * Round Configuration Handler
 */
module.exports.RoundConfigHandler = class RoundConfigHandler {
  /**
   * Constructor
   * @param {Message} message
   */
  constructor(message) {
    this.message = message
  }

  /**
   * Get the round difficulty (easy, normal, hard)
   */
  async getDifficulty() {
    this.message.channel.send(
      'What difficulty do you want to play? (easy, normal, hard)'
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
    if (
      !m.content.toLowerCase() === 'easy' ||
      !m.content.toLowerCase() === 'normal' ||
      !m.content.toLowerCase() === 'hard'
    )
      return this.message.channel.send(
        'This does not seem like a valid difficulty.'
      )

    return m.content.toLowerCase()
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
    const int = parseInt(m.content)
    if (isNaN(int))
      return this.message.channel.send(
        "That doesn't look like a number! That's weird..."
      )
    if (int > 10)
      return this.message.channel.send('You can only start up to 10 rounds!')
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
    console.log(m.content.endsWith('s'))
    if (!m.content.endsWith('s'))
      return this.message.channel.send(
        'This does not seem to be a valid duration.'
      )

    const parsed = parse(m.content)
    if (parsed < 20000)
      return this.message.channel.send(
        'The minimum time is 20 seconds! Please enter a higher value.'
      )
    return { parsed: parsed, value: m.content }
  }
}
