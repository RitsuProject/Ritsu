const { Guilds } = require('../models/Guild')
const { botListPost } = require('../utils/botListPost')

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
      premium: false,
    }).save()
    if (process.env.VERSION === 'production') {
      await botListPost(this.client.guilds.cache.size)
    }
  }
}
