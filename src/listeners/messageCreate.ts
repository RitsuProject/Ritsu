import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import Emojis from '../utils/Emojis'
import RitsuEvent from '../structures/RitsuEvent'
import Users from '../models/User'
import Guilds from '../models/Guild'

class messageCreate extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'messageCreate',
    })
    this.client = client
  }
  async run(message: Message) {
    if (message.author.bot) return
    const guild = await Guilds.findById(message.guildID)
    const user = await Users.findById(message.author.id)
    if (!user) {
      new Users({
        _id: message.author.id,
        name: message.author.discriminator,
        wonMatches: 0,
        played: 0,
        rank: 'Beginner',
        bio: '',
        admin: false,
      }).save()
    }

    if (!message.content.startsWith(guild.prefix)) return

    const args = message.content.slice(guild.prefix.length).trim().split(/ +/g)
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
