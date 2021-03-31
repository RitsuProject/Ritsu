import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, Context } from '@structures/RitsuCommand'

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
    const pings = this.client.shards.map((i) => Math.round(i.latency))

    const msg = await message.channel.createMessage(
      "Don't steal my strawberry, Mugi!"
    )
    void msg.edit(
      `Pong! **WS**: \`${
        pings.reduce((a, b) => a + b, 0) / pings.length
      }\`ms | **API**: \`${Date.now() - createdAt}\`ms`
    )
  }
}

export = Ping
