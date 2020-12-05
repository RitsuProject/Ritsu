const { Command } = require('../../structures/Command')

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
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   */
  async run({ message }) {
    message.reply(
      `Pong! \`${Math.round(this.client.ws.ping)}\`ms! | API: \`${
        Date.now() - message.createdTimestamp
      }\`ms`
    )
  }
}
