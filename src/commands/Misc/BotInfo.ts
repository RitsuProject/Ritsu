import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'
import Room from '@entities/Room'
import Constants from '@utils/Constants'
import Emojis from '@utils/Emojis'
import packageJson from '../../../package.json'
import moment from 'moment'

class BotInfo extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'botinfo',
      description: 'Show all the bot information.',
      category: 'Miscellaneous',
      dev: false,
      aliases: ['info'],
      requiredPermissions: null,
    })
  }

  async run({ message, locales }: CommandContext) {
    const matches = await Room.countDocuments()
    const botOwner = this.client.users.get('326123612153053184')

    const uptime = moment.duration(this.client.uptime)
    const uptimeString = `${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`

    const embed = {
      author: {
        name: locales('commands:botinfo.title'),
        icon_url: this.client.user.avatarURL,
      },
      description: locales('commands:botinfo.ritsuAbout', {
        servers: this.client.guilds.size,
        uptime: uptimeString,
        matches: matches,
        tsEmoji: Emojis.TS_EMOJI,
        githubLink:
          '[github.com/RitsuProject](https://github.com/RitsuProject)',
      }),
      fields: [
        {
          name: locales('commands:botinfo.fields.commands.commands', {
            emoji: Emojis.PRAY_CAT,
          }),
          value: locales('commands:botinfo.fields.commands.useHelpCommand', {
            command: `\`help\``,
          }),
          inline: true,
        },
        {
          name: locales('commands:botinfo.fields.social.social', {
            emoji: Emojis.YAY,
          }),
          value:
            `${Emojis.GITHUB} [Github](https://github.com/RitsuProject/Ritsu)\n` +
            `${Emojis.TWITTER} [Twitter](https://twitter.com/RitsuProject)\n` +
            `${Emojis.RITSU_THINK} [${locales(
              'commands:botinfo.fields.social.supportServer'
            )}](https://discord.gg/XuDysZg)\n` +
            `${Emojis.PATREON} [Patreon](https://www.patreon.com/ritsubot)\n`,
          inline: true,
        },
        {
          name: locales('commands:botinfo.fields.usefulLinks.usefulLinks', {
            emoji: ':link:',
          }),
          value:
            `${Emojis.DISCORD} [Invite](${Constants.INVITE_URL})\n` +
            `${Emojis.DISCORD_BOT_LIST} [(Discord Bot List) ${locales(
              'commands:botinfo.fields.usefulLinks.upvote'
            )}](https://discord.ly/ritsu-5101)\n` +
            `${Emojis.DBL} [(top.gg) ${locales(
              'commands:botinfo.fields.usefulLinks.upvote'
            )}](https://top.gg/bot/763934732420382751/vote)\n`,
          inline: true,
        },
        {
          name: locales('commands:botinfo.fields.specialThanks.specialThanks', {
            emoji: ':medal:',
          }),
          value:
            `**r/AnimeThemes** - ${locales(
              'commands:botinfo.fields.specialThanks.animethemes'
            )}\n` +
            `**openings.moe** - ${locales(
              'commands:botinfo.fields.specialThanks.openingsmoe'
            )}\n` +
            `**AnimeMusicQuiz** - ${locales(
              'commands:botinfo.fields.specialThanks.animemusicquiz'
            )}\n` +
            `**Github Contributors** - ${locales(
              'commands:botinfo.fields.specialThanks.githubContributors'
            )}\n` +
            `**Translators** - ${locales(
              'commands:botinfo.fields.specialThanks.translators'
            )}\n` +
            `**Patrons** - ${locales(
              'commands:botinfo.fields.specialThanks.patrons'
            )}\n` +
            `**Friends** - ${locales(
              'commands:botinfo.fields.specialThanks.friends'
            )}`,
        },
      ],
      thumbnail: {
        url: this.client.user.avatarURL,
      },
      footer: {
        text: locales('commands:botinfo.footer', {
          user: `${botOwner.username}#${botOwner.discriminator}`,
          version: packageJson.version,
          environment: process.env.RITSU_ENVIRONMENT,
        }),
        icon_url: botOwner.avatarURL,
      },
      color: Constants.EMBED_COLOR_BASE,
    }

    void message.channel.createMessage({ embed })
  }
}

export = BotInfo
