import { Message } from 'eris'
import RitsuEvent from '../structures/RitsuEvent'

class messageCreate extends RitsuEvent {
  constructor(client) {
    super(client, {
      name: 'messageCreate',
    })
  }
  async run(message: Message) {
    if (message.author.bot) return

    console.log(message.content)
  }
}

export = messageCreate
