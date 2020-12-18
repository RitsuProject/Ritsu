const { MessageEmbed } = require('discord.js')
const { Badges } = require('../../database/models/Badge')
const { Users } = require('../../database/models/User')
const { Command } = require('../../structures/Command')

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
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */

  async run({ message, args }, _, t) {
    const member =
      message.mentions.users.first() ||
      (await this.client.users.fetch(args[0])) ||
      message.author
    const user = await Users.findById(member.id)
    if (!user) return

    const userBadges = []
    // Get the badges
    for (const b in user.badges) {
      const badge = await Badges.findById(user.badges[b])
      userBadges.push(badge.emoji)
    }

    const embed = new MessageEmbed()
      .setTitle(`${member.tag}`)
      .setDescription(user.bio)
      .setColor('#44e02f')
      .addField(`:trophy: ${t('utils:wonMatches')}`, user.wonMatches, true)
      .addField(`:video_game: ${t('utils:playedMatches')}`, user.played, true)
      .addField(`:medal: ${t('utils:rank')}`, user.rank, true)
      .addField(
        `:star: Stats`,
        `Level: ${user.level} | XP: ${user.xp}/${user.requiredToUP}`,
        true
      )
      .addField(
        `<:msn_star:764659791175221258> ${t('utils:badges')}`,
        user.badges.length > 0
          ? userBadges
              .map((b) => {
                return b
              })
              .join(' ')
          : 'None',
        true
      )
      .setThumbnail(member.displayAvatarURL())

    message.channel.send(embed)
  }
}
