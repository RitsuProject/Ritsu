import { Guild } from 'eris'
import RitsuClient from '@structures/RitsuClient'
import { RitsuEvent } from '@structures/RitsuEvent'
import GuildService from '../services/GuildService'

export default class guildDelete extends RitsuEvent {
  public client: RitsuClient
  public guildService: GuildService = new GuildService()

  constructor(client: RitsuClient) {
    super(client, {
      name: 'guildDelete',
    })
  }

  async run(guild: Guild) {
    await this.guildService.deleteGuild(guild.id)
  }
}
