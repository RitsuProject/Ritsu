import RitsuClient from '@structures/RitsuClient'
import { CommandContext, RitsuCommand } from '@structures/RitsuCommand'
import { TFunction } from 'i18next'

class Help extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'help',
      description: 'This command!',
      category: 'Miscellaneous',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, guild, locales }: CommandContext) {
    const embed = {
      title: locales('commands:help.embed.title', {
        emoji: ':books:',
      }),
      color: 7506394,
      description: locales('commands:help.embed.description'),
      thumbnail: { url: 'https://files.catbox.moe/d6758e.png' },
      fields: [
        {
          name: locales('commands:help.embed.fields.animemusicquiz', {
            emoji: ':video_game:',
          }),
          value: this.getCommandsByCategory(locales, guild.prefix, 'Game'),
          inline: false,
        },
        {
          name: locales('commands:help.embed.fields.utilities', {
            emoji: ':gear:',
          }),
          value: this.getCommandsByCategory(locales, guild.prefix, 'Utils'),
          inline: false,
        },
        {
          name: locales('commands:help.embed.fields.misc', {
            emoji: ':ledger:',
          }),
          value: this.getCommandsByCategory(
            locales,
            guild.prefix,
            'Miscellaneous'
          ),
          inline: false,
        },
        {
          name: locales('commands:help.embed.fields.social', {
            emoji: '🙇',
          }),
          value: this.getCommandsByCategory(locales, guild.prefix, 'Social'),
          inline: false,
        },
      ],
      footer: {
        text: locales('commands:help.embed.footer', {
          url: 'https://ritsu.fun/commands',
        }),
      },
    }
    const dmChannel = await message.author.getDMChannel()
    let dmChannelIsOpen = true
    void dmChannel
      .createMessage({
        content: locales('commands:help.joinSupportServer', {
          invite: 'https://discord.gg/XuDysZg',
        }),
        embed,
      })
      .catch(() => {
        dmChannelIsOpen = false
        void this.reply(message, locales('commands:help.uanvailableDM'))
      })
      .then(() => {
        if (dmChannelIsOpen) {
          void this.reply(message, locales('commands:help.lookDM'))
        }
      })
  }

  getCommandsByCategory(
    locales: TFunction,
    prefix: string,
    category: string
  ): string {
    return this.client.commandManager.commands
      .filter((c) => !c.dev)
      .filter((c) => c.category === category)
      .map(
        (c) =>
          `\`${prefix}${c.name}\` - ${locales(
            `commands:${c.name}.commandDescription`
          )}`
      )
      .join('\n ')
  }
}

export = Help
