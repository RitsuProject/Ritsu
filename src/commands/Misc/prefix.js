const { Guilds } = require('../../models/Guild')
const { Command } = require('../../structures/Command')

module.exports = class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: [],
      description: 'Change the bot prefix.',
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message, args, guild }) {
    if (!args[0]) return message.channel.send('You need to specify the prefix.')
    guild.prefix = args[0]
    guild.save()
    message.channel.send(`The server prefix has been changed: ${args[0]}`)
  }
}
