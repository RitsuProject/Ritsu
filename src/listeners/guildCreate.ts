import { Guild } from 'eris'
import RitsuClient from '@structures/RitsuClient'
import { RitsuEvent } from '@structures/RitsuEvent'
import GuildService from '../services/GuildService'

export default class guildCreate extends RitsuEvent {
  public client: RitsuClient
  public guildService: GuildService = new GuildService()

  constructor(client: RitsuClient) {
    super(client, {
      name: 'guildCreate',
    })
  }

  async run(guild: Guild) {
    await this.guildService.createGuild(guild.id, guild.name)
  }
}
