const { Rooms } = require('../models/Room')
const { Guilds } = require('../models/Guild')
module.exports = class ready {
  constructor(client) {
    this.client = client
  }
  async run() {
    await Guilds.updateMany({}, { rolling: false, currentChannel: null })
    await Rooms.deleteMany({})
    this.client.user.setActivity(
      `${
        process.env.VERSION === 'canary'
          ? 'javascript'
          : `ritsu!help | V.${require('../../package.json').version}`
      }`
    )
  }
}
