import { Guild, Message } from 'eris'
import RitsuClient from '../structures/RitsuClient'

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
  async getGamemode() {
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

  async getRounds() {
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
}
