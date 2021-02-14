import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'

class Ping extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'ping',
      description: 'Pong!',
      category: 'Miscellaneous',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(context: RunArguments) {
    const createdAt = Date.now()
    const msg = await context.message.channel.createMessage(
      'Dont steal my strawberry, Mugi!'
    )
    msg.edit(
      `Pong! **WS**: \`${this.client.shards.map((i) =>
        Math.round(i.latency)
      )}\`ms | **API**: \`${Date.now() - createdAt}\`ms`
    )
  }
}

export = Ping
