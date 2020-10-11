const { MessageEmbed } = require('discord.js')
const { Users } = require('../models/User')
const { Command } = require('../structures/Command')

module.exports = class Profile extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      aliases: [],
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message }) {
    const user = await Users.findById(message.author.id)
    if(!user) return;

    const embed = new MessageEmbed()
    .setTitle(`${user.admin ? "<:ritsuthink:764662176958906388>" : ""} ${message.author.tag}`)
    .setDescription(user.bio)
    .setColor("#44e02f")
    .addField(":trophy: Won Matches", user.wonMatches, true)
    .addField(":video_game: Matches played", user.played, true)
    .addField(":medal: Rank", "Placeholder", true)
    .addField("<:msn_star:764659791175221258> Badges", `${user.admin ? "<:Administrator:764650181127176207>" : ""} `, true)
    .setThumbnail(message.author.displayAvatarURL())

    message.channel.send(embed)
  }
}
