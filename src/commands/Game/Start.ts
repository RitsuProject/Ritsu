import { Message } from 'eris'
import Game from '../../handlers/GameHandler'
import MatchConfig from '../../handlers/MatchSettingsHandler'
import RitsuClient from '../../structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

class Start extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'start',
      description: 'Start a Game!',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message) {
    const matchConfig = new MatchConfig(message, this.client)
    const gamemode = await matchConfig.getGamemode()
    if (!gamemode) return
    const rounds = await matchConfig.getRounds()
    if (!rounds) return
    const duration = await matchConfig.getDuration()
    if (!duration) return

    const game = new Game(message, this.client, {
      mode: gamemode,
      rounds: rounds,
      time: duration.parsed,
      readableTime: duration.value,
    })
    await game.init()
  }
}

export = Start
