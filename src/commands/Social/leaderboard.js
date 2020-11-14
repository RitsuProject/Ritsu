const { MessageEmbed } = require('discord.js')
const { Users } = require('../../models/User')
const { Command } = require('../../structures/Command')

module.exports = class Leaderboard extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['rank', 'scoreboard', 'top'],
      description: 'Show the global leaderboard/rank.',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run(message) {
    const embed = new MessageEmbed()
    embed.setAuthor(
      t('commands:leaderboard.embedAuthor'),
      message.author.displayAvatarURL()
    )
    embed.setColor('#7289DA')
    // Take all users from the database of won matches and use only 10 of them.
    await Users.find()
      .sort({ wonMatches: -1 })
      .limit(10)
      .then((results) => {
        for (const result in results) {
          let fakeResult = parseInt(result)
          const rankNumber = fakeResult + 1
          embed.addField(
            `${rankNumber}.${results[result].name}`,
            `${t('commands:leaderboard.wonMatches')} **${
              results[result].wonMatches
            }**\n${t('commands:leaderboard.playedMatches')} **${
              results[result].played
            }**`
          )
        }
      })
    message.channel.send(embed)
  }
}
