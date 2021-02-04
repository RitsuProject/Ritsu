import { Message } from 'eris'
import Game from '../../lib/GameHandler'
import MatchConfig from '../../lib/MatchSettingsHandler'
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

    const game = new Game(message, this.client, {
      mode: gamemode,
      rounds: rounds,
      time: 30000,
      readableTime: '30s',
    })
    await game.init()
  }
}

export = Start
