const { MessageEmbed, Message } = require('discord.js')
const moment = require('moment')
const { Rooms } = require('../../models/Room')
const { Command } = require('../../structures/Command')

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['info'],
      description: 'Show the bot information.',
      requiredPermissions: null,
      dev: false,
    })
    this.client = client
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   */
  async run({ message }, _, t) {
    const matches = await Rooms.countDocuments({})
    const uptime = moment.duration(this.client.uptime)
    const embed = new MessageEmbed()
      .setAuthor('Ritsu', this.client.user.displayAvatarURL())
      .setDescription(
        t('commands:botinfo.ritsuAbout', {
          jsEmoji: '<:JavaScript:764559579153432616>',
          servers: this.client.guilds.size,
          days: uptime.days(),
          hours: uptime.hours(),
          minutes: uptime.minutes(),
          seconds: uptime.seconds(),
          matches: matches,
        })
      )
      .setColor('#3677e0')
      .setThumbnail('https://files.catbox.moe/d6758e.png')
      .addFields(
        {
          name: `<:blobElegant:764561836174999572> ${t(
            'commands:botinfo.commands'
          )}`,
          value: t('commands:botinfo.useHelpCommand'),
          inline: true,
        },
        {
          name: `<:blobBlush:775007392772390922> Social`,
          value: `
          <:github:764559500941852692> [Github](https://github.com/RitsuProject/Ritsu)
          <:Twitter:764952510674763786> [Twitter](https://twitter.com/RitsuProject)
          <:ritsuthink:764662176958906388> [${t(
            'commands:botinfo.supportServer'
          )}](https://discord.gg/XuDysZg)
          <:Patreon:764559661374242826> [Patreon](https://www.patreon.com/ritsubot)
          `,
          inline: true,
        },
        {
          name: `:link: ${t('commands:botinfo.usefulLinks')}`,
          value: `
            <:discord:764952620842090537> [Invite](https://discord.com/oauth2/authorize/?permissions=3145728&scope=bot&client_id=763934732420382751)
            <:discordbotlist:767376357600264192> [(Discord Bot List) ${t(
              'commands:botinfo.upvote'
            )}](https://discord.ly/ritsu-5101)
            <:dbl:775006065250009129> [(top.gg) ${t(
              'commands:botinfo.upvote'
            )}}](https://top.gg/bot/763934732420382751/vote)
            `,
          inline: true,
        },
        {
          name: `:medal: ${t('commands:botinfo.credits')}`,
          value: `
            **r/AnimeThemes** - ${t(
              'commands:botinfo.creditsDescriptions.themes'
            )}
            **openings.moe** - ${t(
              'commands:botinfo.creditsDescriptions.themes'
            )}
            **Anime Music Quiz** - ${t(
              'commands:botinfo.creditsDescriptions.animemusicquiz'
            )}
            **kyuu-chan-hackweek** - ${t(
              'commands:botinfo.creditsDescriptions.kyuuchan'
            )}
            **Gabriel Bifano, FelipeSazz and Pedro Lyrio** - ${t(
              'commands:botinfo.creditsDescriptions.creators'
            )}
            `,
          inline: false,
        }
      )
      .setFooter(`Ritsu | ${process.env.VERSION}`)

    message.channel.send(embed)
  }
}
