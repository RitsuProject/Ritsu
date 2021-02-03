import { Message } from 'eris'
import Game from '../../lib/Game'
import MatchConfig from '../../lib/MatchConfig'
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
    const matchConfig = new MatchConfig(message)
    const gamemode = await matchConfig.getGamemode()
    const game = new Game(message, this.client, {
      mode: gamemode,
      rounds: 3,
      time: 30000,
      readableTime: '30s',
    })
    await game.init()
  }
}

export = Start
