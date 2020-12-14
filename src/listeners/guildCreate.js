const { Guilds } = require('../database/models/Guild')
// eslint-disable-next-line no-unused-vars
const { Ritsu } = require('../client/RitsuClient')
const { updateBotList } = require('../utils/functions/updateBotList')
module.exports = class guildCreate {
  /**
   *
   * @param {Ritsu} client
   */
  constructor(client) {
    this.client = client
  }

  async run(guild) {
    const guild_ = new Guilds({
      _id: guild.id,
      name: guild.name,
      rolling: false,
      currentChannel: null,
      premium: false,
    })
    await guild_.save()
    if (process.env.VERSION === 'production') {
      await updateBotList(this.client.guilds.cache.size)
    }
    // Send a fancy message to the owner.
    const owner = await this.client.users.fetch(guild.ownerID)
    owner.send(`
    Hi! It looks like someone added me to your server! My name is Ritsu, I am a bot based on the game AnimeMusicQuiz, which the concept is to guess anime by opening or ending music! You can see more information about me by mentioning me on your server!
    
    If you have any problems, or just want to chat with the developers and give your feedback, feel free to join my little support server! https://discord.gg/XuDysZg
    `)
    this.client.prometheus.serversJoined.inc()
  }
}
