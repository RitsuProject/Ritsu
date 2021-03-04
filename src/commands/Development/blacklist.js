const { Guilds } = require('../../database/models/Guild')
const { Command } = require('../../structures/Command')

module.exports = class Blacklist extends Command {
  constructor(client) {
    super(client, {
      name: 'blacklist',
      aliases: [],
      description: 'Blacklist a Server',
      requiredPermissions: null,
      dev: true,
    })
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   */

  async run({ message, args }) {
    const serverId = args[0]
    const isABan = args[1] // true or false
    const guild = await Guilds.findById(serverId)
    guild.blacklisted = isABan
    await guild.save()
    message.channel.send('OK')
  }
}
