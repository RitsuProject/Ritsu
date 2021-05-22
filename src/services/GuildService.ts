import Guild from '../database/entities/Guild'

export default class GuildService {
  async createGuild(id: string, name: string) {
    await new Guild({
      _id: id,
      name: name,
    }).save()
  }

  async deleteGuild(id: string) {
    await Guild.findByIdAndDelete(id)
  }

  async getGuild(id: string) {
    return await Guild.findById(id)
  }

  async getOrCreate(id: string, name: string) {
    let guild = await Guild.findById(id)
    if (!guild) {
      guild = new Guild({
        _id: id,
        name: name,
      })
      await guild.save()
    }

    return guild
  }
}
