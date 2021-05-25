import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'
import Constants from '../../utils/Constants'

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

  async run({ message, locales }: CommandContext) {
    const createdAt = Date.now()
    const guild = this.client.guilds.get(message.guildID)
    const shards = this.client.shards.size
    const guildShardId = guild.shard.id
    const shardPing = this.client.shards
      .filter((shard) => shard.id === guildShardId)
      .map((shard) => {
        return Math.round(shard.latency)
      })

    const shardName = Constants.SHARDS[guildShardId]

    const msg = await message.channel.createMessage(
      locales('commands:ping.stealMessage')
    )
    void msg.edit(
      `Pong! **Shard**: \`${shardName}\` - ${guildShardId}/${shards} | **WS**: \`${shardPing}\`ms | **API**: \`${
        Date.now() - createdAt
      }\`ms`
    )
  }
}

export = Ping
