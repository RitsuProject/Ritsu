const { Guilds } = require('../models/Guild')

module.exports = class guildDelete {
  constructor(client) {
    this.client = client
  }
  async run(guild) {
      const guild_ = await Guilds.findById(guild.id)
      guild_.remove()
  }
}
