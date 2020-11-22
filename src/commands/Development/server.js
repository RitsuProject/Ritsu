const { Servers } = require('../../models/Servers')
const { Command } = require('../../structures/Command')

module.exports = class Eval extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: 'server',
      aliases: [],
      requiredPermissions: null,
      description: 'a',
      dev: true,
    })
    this.client = client
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run({ message, args }) {
    const server = args[0]
    const status = args[1]
    const server_ = await Servers.findById('status')

    switch (server) {
      case 'animethemes': {
        server_.animethemes = status
        server_.save()
        break
      }
      case 'openingsmoe': {
        server_.openingsmoe = status
        server_.save()
        break
      }
    }
    message.channel.send('OK')
  }
}
