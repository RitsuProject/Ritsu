const { MessageEmbed } = require('discord.js')
const { Rooms } = require('../models/Room')
const { Command } = require('../structures/Command')

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['info'],
      description: "Show the bot information.",
      requiredPermissions: null,
      dev: false,
    })
    this.client = client
  }

  async run({ message }) {
    const matches = await Rooms.countDocuments({})
    const embed = new MessageEmbed()
      .setAuthor('Ritsu', this.client.user.displayAvatarURL())
      .setDescription(
        `Hi! I am **Ritsu** and I am a bot based on the game **Anime Music Quiz** made with <:JavaScript:764559579153432616> **Javascript** using discord.js, your objective in the game is simple, I will play an opening or ending and you must guess what his anime is! I am on **${this.client.guilds.cache.size}** servers with **${matches}** current matches right now!`
      )
      .setColor('#3677e0')
      .setThumbnail('https://i.imgur.com/6a0amL5.jpg')
      .addFields(
        {
          name: '<:blobElegant:764561836174999572> Commands',
          value: 'Use the `help` command!',
          inline: true,
        },
        {
          name: '<:github:764559500941852692>  Source Code',
          value: '[Github](https://github.com/RitsuProject/Ritsu)',
          inline: true,
        },
        {
          name: ":link: Useful links",
          value:"<:Twitter:764952510674763786> [Twitter](https://twitter.com/RitsuProject)\n<:discord:764952620842090537> [Invite](https://discord.com/oauth2/authorize/?permissions=8&scope=bot&client_id=763934732420382751)",
          inline: true
        },
        {
          name: ':medal: Credits',
          value:
            "**r/AnimeThemes** - For providing the themes for the bot to play.\n**Anime Music Quiz** - Of course, the biggest inspiration for this project.\n**kyuu-chan-hackweek** - Many parts of the code I was inspired by it.\n**Gabriel Bifano, FelipeSazz and Pedro Lyrio** - Ideas, development and a lot of patience, without these 3 people the bot probably wouldn't exist.",
          inline: false,
        }
      )
      .setFooter('sazz.fail | @FelipeSazz')

    message.channel.send(embed)
  }
}
