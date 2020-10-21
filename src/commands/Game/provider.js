const { Command } = require('../../structures/Command')

module.exports = class Provider extends Command {
  constructor(client) {
    super(client, {
      name: 'provider',
      aliases: [],
      description: 'Change the themes provider.',
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message, args, guild }) {
    if (!args[0]) return message.channel.send('Please specify the provider.')

    if (
      args[0].toLowerCase() === 'openingsmoe' ||
      args[0].toLowerCase() === 'animethemes'
    ) {
      guild.provider = args[0].toLowerCase()
      guild.save()
      message.channel.send(`The theme provider is now ${guild.provider}.`)
    } else {
      message.channel.send(
        'This does not appear to be a valid or supported provider, here is the list of providers that Ritsu likes:\n\nAnimeThemes\nopeningsmoe'
      )
    }
  }
}
