import { Guild } from 'eris'
import Guilds from '../database/entities/Guild'
import RitsuClient from '../structures/RitsuClient'
import { RitsuEvent } from '../structures/RitsuEvent'

export default class guildCreate extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'guildCreate',
    })
  }

  run(guild: Guild) {
    void new Guilds({
      _id: guild.id,
      name: guild.name,
      rolling: false,
      currentChannel: null,
      premium: false,
    }).save()
  }
}
