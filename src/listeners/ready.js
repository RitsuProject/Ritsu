const { Rooms } = require('../database/models/Room')
const { Guilds } = require('../database/models/Guild')
const os = require('os-utils')
module.exports = class ready {
  constructor(client) {
    this.client = client
  }

  async run() {
    await Guilds.updateMany({}, { rolling: false, currentChannel: null })
    await Rooms.deleteMany({})
    this.client.user.setActivity(
      `${
        process.env.VERSION === 'canary' ? 'javascript' : `ritsu!help | @Ritsu`
      }`
    )
    this.client.prometheus.serversJoined.set({}, this.client.guilds.cache.size)
    this.client.prometheus.ping.set({}, this.client.ws.ping)

    setInterval(() => {
      this.client.prometheus.ramUsage.set(
        {},
        process.memoryUsage().heapUsed / 1024 / 1024
      )

      os.cpuUsage((p) => {
        this.client.prometheus.cpuUsage.set({}, p)
      })
    }, 2000)
  }
}
