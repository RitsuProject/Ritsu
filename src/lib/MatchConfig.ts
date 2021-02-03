import { Guild, Message } from 'eris'

export default class MatchConfig {
  private message: Message
  private guild: Guild
  constructor(message: Message) {
    this.message = message
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
          this.message.channel.createMessage('lol')
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
      if (specifiedMode === 'easy') {
        await primary.delete()
        await m.delete()
        return specifiedMode
      } else {
        throw new Error('Invalid Game Mode.')
      }
    })
    return mode
  }
}
