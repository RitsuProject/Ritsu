const { Command } = require('../../structures/Command')

module.exports = class Invite extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['add'],
      description: 'Add me in your server!',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run(message, args, guild) {
    message.channel.send(
      `**You can add me to your server using this link https://sazz.fail/ritsu/invite**\n\nWant to stay on top of new updates and chat with the developers? Join to my support server! Just take a look at **${guild.prefix}botinfo** ^w^`
    )
  }
}
