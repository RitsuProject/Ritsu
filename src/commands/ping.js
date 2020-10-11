const { Command } = require('../structures/Command')

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      aliases: [],
      description: 'Show the bot latency.',
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message }) {
    message.reply('Pong!')
  }
}
