import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import Emojis from '../utils/Emojis'
import RitsuEvent from '../structures/RitsuEvent'

class messageCreate extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'messageCreate',
    })
    this.client = client
  }
  async run(message: Message) {
    const prefix = 'mugi!' // remove this soon.
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()

    const command = this.client.commandManager.commands.get(commandName)
    if (!command) return

    new Promise((resolve) => {
      resolve(command.run(message, args))
    }).catch((e: Error) => {
      message.channel.createMessage(
        `${Emojis.BONGOCAT} | Oh, no! A fatal error!\n${e.message}`
      )
    })
  }
}

export = messageCreate
