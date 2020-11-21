const { MessageEmbed, Message } = require('discord.js')
const moment = require('moment')
const { Rooms } = require('../../models/Room')
const { Command } = require('../../structures/Command')

module.exports = class BotInfo extends (
  Command
) {
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
   * @param {Message} message
   * @param {Array} args
   */
  async run(message, args) {
    const matches = await Rooms.countDocuments({})
    const uptime = moment.duration(this.client.uptime)
    const embed = new MessageEmbed()
      .setAuthor('Ritsu', this.client.user.displayAvatarURL())
      .setDescription(
        `Hi! I am **Ritsu** and I am a bot based on the game **Anime Music Quiz** made with <:JavaScript:764559579153432616> **Javascript** using discord.js, your objective in the game is simple, I will play an opening or ending and you must guess what his anime is! I am on **${
          this.client.guilds.cache.size
        }** servers, i'm online since **${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s** and with **${matches}** current matches right now!`
      )
      .setColor('#3677e0')
      .setThumbnail('https://files.catbox.moe/d6758e.png')
      .addFields(
        {
          name: '<:blobElegant:764561836174999572> Commands',
          value: 'Use the `help` command!',
          inline: true,
        },
        {
          name: '<:blobBlush:775007392772390922> Social',
          value: `
          <:github:764559500941852692> [Github](https://github.com/RitsuProject/Ritsu)
          <:Twitter:764952510674763786> [Twitter](https://twitter.com/RitsuProject)
          <:ritsuthink:764662176958906388> [Support Server](https://discord.gg/XuDysZg)
          <:Patreon:764559661374242826> [Patreon](https://www.patreon.com/ritsubot)
          `,
          inline: true,
        },
        {
          name: ':link: Useful links',
          value: `
            <:discord:764952620842090537> [Invite](https://discord.com/oauth2/authorize/?permissions=3145728&scope=bot&client_id=763934732420382751)
            <:discordbotlist:767376357600264192> [(Discord Bot List) Upvote the Bot!](https://discord.ly/ritsu-5101)
            <:dbl:775006065250009129> [(top.gg) Upvote the Bot!](https://top.gg/bot/763934732420382751/vote)
            `,
          inline: true,
        },
        {
          name: ':medal: Credits',
          value: `
            **r/AnimeThemes** - For providing the themes for the bot to play.
            **openings.moe** - For providing the themes for the bot to play.
            **Anime Music Quiz** - Of course, the biggest inspiration for this project.
            **kyuu-chan-hackweek** - Many parts of the code I was inspired by it.
            **Gabriel Bifano, FelipeSazz and Pedro Lyrio** - Ideas, development and a lot of patience, without these 3 people the bot probably wouldn't exist.
            `,
          inline: false,
        }
      )
      .setFooter(`Ritsu | ${process.env.VERSION}`)

    message.channel.send(embed)
  }
}
