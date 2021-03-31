import RitsuClient from '../../structures/RitsuClient'
import { Context, RitsuCommand } from '@structures/RitsuCommand'
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

  async run({ message, guild, t }: Context) {
    const embed = {
      title: t('commands:help.embed.title', {
        emoji: ':books:',
      }),
      color: 7506394,
      description: t('commands:help.embed.description'),
      thumbnail: { url: 'https://files.catbox.moe/d6758e.png' },
      fields: [
        {
          name: t('commands:help.embed.fields.animemusicquiz', {
            emoji: ':video_game:',
          }),
          value: this.getCommandsByCategory(t, guild.prefix, 'Game'),
          inline: false,
        },
        {
          name: t('commands:help.embed.fields.utilities', {
            emoji: ':gear:',
          }),
          value: this.getCommandsByCategory(t, guild.prefix, 'Utils'),
          inline: false,
        },
        {
          name: t('commands:help.embed.fields.misc', {
            emoji: ':ledger:',
          }),
          value: this.getCommandsByCategory(t, guild.prefix, 'Miscellaneous'),
          inline: false,
        },
        {
          name: t('commands:help.embed.fields.social', {
            emoji: '🙇',
          }),
          value: this.getCommandsByCategory(t, guild.prefix, 'Social'),
          inline: false,
        },
      ],
      footer: {
        text: t('commands:help.embed.footer', {
          url: 'https://ritsu.fun/commands',
        }),
      },
    }
    const dmChannel = await message.author.getDMChannel()
    let openDmChannel = true
    void dmChannel
      .createMessage({
        content: t('commands:help.joinSupportServer', {
          invite: 'https://discord.gg/XuDysZg',
        }),
        embed,
      })
      .catch(() => {
        openDmChannel = false
        void message.channel.createMessage(t('commands:help.uanvailableDM'))
      })
      .then(() => {
        if (openDmChannel) {
          void message.channel.createMessage(t('commands:help.lookDM'))
        }
      })
  }

  getCommandsByCategory(
    t: TFunction,
    prefix: string,
    category: string
  ): string {
    return this.client.commandManager.commands
      .filter((c) => !c.dev)
      .filter((c) => c.category === category)
      .map(
        (c) =>
          `\`${prefix}${c.name}\` - ${t(
            `commands:${c.name}.commandDescription`
          )}`
      )
      .join('\n ')
  }
}

export = Help
