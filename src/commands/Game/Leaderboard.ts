import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

class Leaderboard extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'leaderboard',
      description: 'See the actual Ritsu ranking by level.',
      category: 'Game',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message) {}
}

export = Leaderboard
