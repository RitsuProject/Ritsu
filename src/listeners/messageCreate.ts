import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import RitsuEvent from '../structures/RitsuEvent'
import Users from '../database/entities/User'
import Guilds from '../database/entities/Guild'
import Constants from '../utils/Constants'
import GuildsInterface from '../interfaces/GuildsInterface'

class messageCreate extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'messageCreate',
    })
    this.client = client
  }

  async run(message: Message): Promise<void> {
    if (message.author.bot) return
    if (message.channel.type === 1) return // Avoid DM messages.
    const guild: GuildsInterface = await Guilds.findById(message.guildID)
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

    const isRitsuMention = this.isRitsuMention(message)
    const isGuildPrefix = this.isGuildPrefix(message, guild)

    // Check if the prefix is the Ritsu Mention or the Guild Prefix
    const prefix = isRitsuMention
      ? `<@!${this.client.user.id}>`
      : isGuildPrefix
      ? guild.prefix
      : false

    if (!prefix) return
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/[ \t]+/)
    const commandName = args.shift().toLowerCase()

    if (commandName === '') {
      if (isRitsuMention) message.channel.createMessage('oh hi')
    }

    const command = this.client.commandManager.commands.get(commandName)
    if (!command) return

    new Promise((resolve) => {
      resolve(command.run(message, args, guild))
    }).catch((e: Error) => {
      console.log(e)
      message.channel.createMessage(
        Constants.DEFAULT_ERROR_MESSAGE.replace('$e', e.message)
      )
    })
  }

  isGuildPrefix(message: Message, guild: GuildsInterface): boolean {
    return message.content.startsWith(guild.prefix)
  }

  isRitsuMention(message: Message): boolean {
    return message.content.startsWith(`<@!${this.client.user.id}>`)
  }
}

export = messageCreate
