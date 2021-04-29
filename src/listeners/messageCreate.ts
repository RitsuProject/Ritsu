import { Message } from 'eris'
import RitsuClient from '@structures/RitsuClient'
import { RitsuEvent } from '@structures/RitsuEvent'
import Users from '@entities/User'
import Guilds, { GuildDocument } from '@entities/Guild'
import i18next from 'i18next'
import Emojis from '@utils/Emojis'

export default class messageCreate extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'messageCreate',
    })
  }

  async run(message: Message): Promise<void> {
    if (message.author.bot) return
    if (message.channel.type === 1) return // Avoid DM messages.
    const guild = await Guilds.findById(message.guildID)
    const user = await Users.findById(message.author.id)
    if (!user) {
      void new Users({
        _id: message.author.id,
        name: message.author.discriminator,
        wonMatches: 0,
        played: 0,
        rank: 'Beginner',
        bio: '',
        admin: false,
      }).save()
    } else {
      user.name = message.author.discriminator
      await user.save()
    }

    const t = i18next.getFixedT(guild.lang)

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
      if (isRitsuMention)
        void message.channel.createMessage(
          t('utils:mentionRitsu', { prefix: guild.prefix })
        )
    }

    const command = this.client.commandManager.commands.get(commandName)
    if (!command) return

    new Promise((resolve) => {
      resolve(command.run({ message, args, guild, t }))
    }).catch((e: Error) => {
      console.log(e)
      void message.channel.createMessage(
        t('errors:genericError', {
          emoji: Emojis.AQUA_CRYING,
          e: `\`${e.message}\``,
        })
      )
    })
  }

  isGuildPrefix(message: Message, guild: GuildDocument): boolean {
    return message.content.startsWith(guild.prefix)
  }

  isRitsuMention(message: Message): boolean {
    return message.content.startsWith(`<@!${this.client.user.id}>`)
  }
}
