const { Command } = require('../../structures/Command')
const { inspect } = require('util')

const { Users } = require('../../models/User')
const { Guilds } = require('../../models/Guild')
const { Rooms } = require('../../models/Room')
const { Badges } = require('../../models/Badge')

module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      aliases: [],
      requiredPermissions: null,
      description: 'a',
      dev: true,
    })
    this.client = client
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */
  async run({ message, args }) {
    const code = args.slice(0).join(' ')
    try {
      let evaled = await eval(code)
      evaled = inspect(evaled, { depth: 1 })
      if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`

      message.channel.send(evaled, { code: 'js' })
    } catch (e) {
      message.channel.send(e)
    }
  }
}
