const { Guilds } = require('../models/Guild')
const { botListPost } = require('../utils/botListPost')
module.exports = class guildDelete {
  constructor(client) {
    this.client = client
  }
  async run(guild) {
    const guild_ = await Guilds.findById(guild.id)
    guild_.remove()
    if (process.env.VERSION === 'production') {
      await botListPost(this.client.guilds.cache.size)
    }
  }
}
