import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

class Ping extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'ping',
      description: 'Pong!',
      dev: false,
      aliases: [],
    })
    this.client = client
  }

  async run(message: Message) {
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
