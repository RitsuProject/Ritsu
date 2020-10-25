const { Servers } = require('../../models/Servers')
const { Command } = require('../../structures/Command')

module.exports = class Eval extends Command {
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

  async run({ message, args }) {
    const server = args[0]
    const status = args[1]
    const _server = await Servers.findById('status')

    switch (server) {
      case 'animethemes': {
        _server.animethemes = status
        _server.save()
        break
      }
      case 'openingsmoe': {
        _server.openingsmoe = status
        _server.save()
        break
      }
    }
    message.channel.send('OK')
  }
}
