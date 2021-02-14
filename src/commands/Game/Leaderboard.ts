import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'

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

  async run(context: RunArguments) {
    return context.message.channel.createMessage('bunda')
  }
}

export = Leaderboard
