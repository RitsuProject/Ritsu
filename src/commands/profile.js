const { MessageEmbed } = require('discord.js')
const { Users } = require('../models/User')
const { Command } = require('../structures/Command')

module.exports = class Profile extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      aliases: ['user'],
      description: 'Show your profile.',
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message, args }) {
    const member =
      message.mentions.users.first() ||
      this.client.users.cache.get(args[0]) ||
      message.author
    const user = await Users.findById(member.id)
    if (!user) return

    const embed = new MessageEmbed()
      .setTitle(
        `${user.admin ? '<:ritsuthink:764662176958906388>' : ''} ${member.tag}`
      )
      .setDescription(user.bio)
      .setColor('#44e02f')
      .addField(':trophy: Won Matches', user.wonMatches, true)
      .addField(':video_game: Matches played', user.played, true)
      .addField(':medal: Rank', user.rank, true)
      .addField(
        '<:msn_star:764659791175221258> Badges',
        `${user.admin ? '<:Administrator:764650181127176207>' : 'None'} `,
        true
      )
      .setThumbnail(member.displayAvatarURL())

    message.channel.send(embed)
  }
}
