const { Command } = require('../../structures/Command')

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'lang',
      aliases: ['language'],
      description: 'Change the server language.',
      requiredPermissions: ['MANAGE_GUILD'],
      dev: false,
    })
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run({ message, args, guild }) {
    const lang = args[0]
    guild.lang = lang
    guild.save()
    message.channel.send('jojo')
  }
}
