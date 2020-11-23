const { GameService } = require('../../handlers/GameHandler')
const { Command } = require('../../structures/Command')
const { RoundConfigHandler } = require('../../handlers/RoundConfigHandler')

module.exports = class Start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      aliases: ['play'],
      description: 'Start the game.',
      requiredPermissions: null,
      fields: ['OPTIONAL: default (to use the default configuration)'],
      dev: false,
    })
    this.client = client
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */
  async run({ message, args }, guild, t) {
    if (guild.rolling)
      return message.channel.send(t('commands:start.rollingMatch'))

    const tip = await message.channel.send(
      t('commands:start.tip', { prefix: guild.prefix })
    )

    // Default Configuration
    let mode = 'normal'
    let rounds = 3
    let time = { parsed: 30000, value: '30s' }

    let listService
    let listUsername
    let season

    if (args[0] !== 'default') {
      // If user specified default in the command, skip configuration.
      // Get the user configuration.
      const roundConfig = new RoundConfigHandler(message, guild, t)
      mode = await roundConfig.getGamemode()
      if (typeof mode !== 'string') return
      if (mode === 'list') {
        listService = await roundConfig.getListService()
        if (typeof listService !== 'string') return
        listUsername = await roundConfig.getListUsername(listService)
        if (typeof listUsername !== 'string') return
      } else if (mode === 'event') {
        message.channel.send(t('commands:start.roundConfig.eventModeWarning'))
      } else if (mode === 'season') {
        season = await roundConfig.getSeason()
        if (typeof season.year !== 'string') return
      }
      rounds = await roundConfig.getRounds()
      if (typeof rounds !== 'number') return
      time = await roundConfig.getDuration()
      if (typeof time.parsed !== 'number') return
    }

    const gameService = new GameService(message, this.client, {
      mode: mode,
      rounds: rounds,
      time: time.parsed,
      realTime: time.value,
      listService: `${mode === 'list' ? listService : null}`,
      listUsername: `${mode === 'list' ? listUsername : null}`,
      year: `${mode === 'season' ? season.year : null}`,
      season: `${mode === 'season' ? season.season : null}`,
      listUsername: `${mode === 'list' ? listUsername : null}`,
      t: t,
    })
    gameService.init()
    tip.delete()
  }
}
