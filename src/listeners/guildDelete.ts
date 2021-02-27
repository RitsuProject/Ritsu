import { Guild } from 'eris'
import Guilds from '../database/entities/Guild'
import RitsuClient from '../structures/RitsuClient'
import RitsuEvent from '../structures/RitsuEvent'

class guildDelete extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'guildDelete',
    })
  }

  async run(guild: Guild) {
    await Guilds.findByIdAndDelete(guild.id)
  }
}

export = guildDelete
