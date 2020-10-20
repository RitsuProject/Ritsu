const { Guilds } = require('../../models/Guild')
const { GameService } = require('../../services/GameService')
const { Command } = require('../../structures/Command')

const parse = require('parse-duration')

module.exports = class Start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      aliases: [],
      description: 'Start the game.',
      requiredPermissions: null,
      fields: [
        'OPTIONAL: year (default: random)',
        'OPTIONAL: rounds (default: 3)',
        'OPTIONAL: time (default: 30s)',
      ],
      dev: false,
    })
  }

  async run({ message, args, guild }) {
    if (guild.rolling)
      return message.channel.send(
        'There is already a match running on a voice channel on that server.'
      )

    const rounds = args[1]
    const year = args[0]
    const time = args[2]
    let timeParsed
    if (time) {
      timeParsed = parse(time)
    }

    if (rounds > 10)
      return message.channel.send(
        'You can only start a game with a maximum of 10 rounds!'
      )

    const gameService = new GameService(message, {
      year: `${year ? year : 'random'}`,
      rounds: `${rounds ? rounds : '3'}`,
      time: `${time ? timeParsed : '30000'}`,
      realTime: `${time ? time : '30s'}`,
    })
    gameService.init()
  }
}
