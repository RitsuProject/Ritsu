const { Guilds } = require('../../models/Guild')
const { Command } = require('../../structures/Command')

module.exports = class Prefix extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: [],
      description: 'Change the bot prefix.',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run({ message, args }, guild, t) {
    if (!args[0]) return message.channel.send(t('commands:prefix.noPrefix'))
    guild.prefix = args[0]
    guild.save()
    message.channel.send(
      t('commands:prefix.changedPrefix', { newPrefix: args[0] })
    )
  }
}
