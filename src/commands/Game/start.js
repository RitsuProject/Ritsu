const { GameService } = require('../../handlers/GameHandler')
const { Command } = require('../../structures/Command')
const { RoundConfigHandler } = require('../../handlers/RoundConfigHandler')

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
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run(message, args, guild) {
    if (guild.rolling)
      return message.channel.send(
        'There is already a match running on a voice channel on that server.'
      )

    // Get the user configuration.
    const roundConfig = new RoundConfigHandler(message)
    const mode = await roundConfig.getDifficulty()
    if (typeof mode !== 'string') return
    const rounds = await roundConfig.getRounds()
    if (typeof rounds !== 'number') return
    const time = await roundConfig.getDuration()
    console.log(typeof time)
    if (typeof time !== 'object') return

    const gameService = new GameService(message, {
      mode: mode,
      rounds: rounds,
      time: time.parsed,
      realTime: time.value,
    })
    gameService.init()
  }
}
