const { Guilds } = require('../models/Guild')
const { Ritsu } = require('../Ritsu')
const { botListPost } = require('../utils/functions/updateBotList.js')
module.exports = class guildDelete {
  /**
   *
   * @param {Ritsu} client
   */
  constructor(client) {
    this.client = client
  }
  async run(guild) {
    const guild_ = await Guilds.findById(guild.id)
    guild_.remove()
    if (process.env.VERSION === 'production') {
      await botListPost(this.client.guilds.cache.size)
    }
    this.client.prometheus.serversJoined.dec()
  }
}
