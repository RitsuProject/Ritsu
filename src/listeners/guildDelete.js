const { Guilds } = require('../database/models/Guild')
// eslint-disable-next-line no-unused-vars
const { Ritsu } = require('../client/RitsuClient')
const { updateBotList } = require('../utils/functions/updateBotList.js')
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
      await updateBotList(this.client.guilds.cache.size)
    }
    this.client.prometheus.serversJoined.dec()
  }
}
