import { Message } from 'eris'
import RitsuClient from '@structures/RitsuClient'
import { RitsuEvent } from '@structures/RitsuEvent'
import { GuildDocument } from '@entities/Guild'
import i18next from 'i18next'
import Emojis from '@utils/Emojis'
import RitsuUtils from '@utils/RitsuUtils'
import UserService from '../services/UserService'
import GuildService from '../services/GuildService'

export default class messageCreate extends RitsuEvent {
  public client: RitsuClient
  public guildService: GuildService = new GuildService()
  public userService: UserService = new UserService()

  constructor(client: RitsuClient) {
    super(client, {
      name: 'messageCreate',
    })
  }

  async run(message: Message): Promise<void> {
    if (message.author.bot) return
    if (message.channel.type === 1) return // Avoid DM messages.

    const guild = await this.guildService.getGuild(message.guildID)
    const user = await this.userService.getOrCreate(
      message.author.id,
      message.author.username
    )

    // Always mantain the user username updated in the database for future use.
    if (message.author.username !== user.name) {
      user.name = message.author.username
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

    const command = this.client.commandManager.getCommand(commandName)
    if (!command) return

    const userHasCommandPermissions = RitsuUtils.userHasPermissions(
      message.member,
      command.requiredPermissions
    )
    if (!userHasCommandPermissions) return

    new Promise((resolve) => {
      resolve(command.run({ message, args, guild, user, t }))
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
