import { Message } from 'eris'
import Game from '../../quiz/Game'
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
    const game = new Game(message, this.client, {
      mode: 'easy',
      rounds: 3,
      time: 30000,
      readableTime: '30s',
    })
    await game.init()
  }
}

export = Start
