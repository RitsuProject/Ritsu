const { Guilds } = require('../models/Guild')

module.exports = class guildCreate {
  constructor(client) {
    this.client = client
  }
  async run(guild) {
    new Guilds({
      _id: guild.id,
      name: guild.name,
      rolling: false,
      currentChannel: null,
      correctAnime: null,
      bestUser: null,
      premium: false,
    }).save()
  }
}
