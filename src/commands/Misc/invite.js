const { Command } = require('../../structures/Command')

module.exports = class Invite extends Command {
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
  async run({ message }, guild, t) {
    message.channel.send(
      t('commands:invite.inviteMessage', {
        inviteUrl: 'https://sazz.fail/ritsu',
        prefix: guild.prefix,
      })
    )
  }
}
