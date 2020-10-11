const { Guilds } = require('../models/Guild')
const { GameService } = require('../services/GameService')
const { Command } = require('../structures/Command')

module.exports = class Start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      aliases: [],
      description: 'Start the game.',
      requiredPermissions: null,
      fields: ['OPTIONAL: rounds', 'OPTIONAL: year'],
      dev: false,
    })
  }

  async run({ message, args }) {
    const guild = await Guilds.findById(message.guild.id)
    if (guild.rolling)
      return message.channel.send(
        'There is already a match running on a voice channel on that server.'
      )

    const rounds = args[0]
    const year = args[1]
    if (rounds > 10)
      return message.channel.send(
        'You can only start a game with a maximum of 10 rounds!'
      )

    const gameService = new GameService(message, {
      year: `${year ? year : 'random'}`,
      rounds: `${rounds ? rounds : '3'}`,
    })
    gameService.init()
  }
}
