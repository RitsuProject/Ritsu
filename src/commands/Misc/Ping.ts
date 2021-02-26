import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, Context } from '../../structures/RitsuCommand'

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
  }

  async run({ message }: Context) {
    const createdAt = Date.now()
    const msg = await message.channel.createMessage(
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
