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
  async run(message, guild) {
    if (guild.rolling)
      return message.channel.send(
        'There is already a match running on a voice channel on that server.'
      )

    // Get the user configuration.
    const roundConfig = new RoundConfigHandler(message, guild)
    const mode = await roundConfig.getGamemode()
    if (typeof mode !== 'string') return
    const rounds = await roundConfig.getRounds()
    if (typeof rounds !== 'number') return
    const time = await roundConfig.getDuration()
    if (typeof time.parsed !== 'number') return
    let listService
    let listUsername
    if (mode === 'list') {
      listService = await roundConfig.getListService()
      if (typeof listService !== 'string') return
      listUsername = await roundConfig.getListUsername(listService)
      if (typeof listUsername !== 'string') return
    }

    const gameService = new GameService(message, {
      mode: mode,
      rounds: rounds,
      time: time.parsed,
      realTime: time.value,
      listService: `${mode === 'list' ? listService : null}`,
      listUsername: `${mode === 'list' ? listUsername : null}`,
    })
    gameService.init()
  }
}
