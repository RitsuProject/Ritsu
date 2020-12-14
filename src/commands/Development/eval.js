const { Command } = require('../../structures/Command')
const { inspect } = require('util')

// eslint-disable-next-line no-unused-vars
const { Users } = require('../../database/models/User')
// eslint-disable-next-line no-unused-vars
const { Guilds } = require('../../database/models/Guild')
// eslint-disable-next-line no-unused-vars
const { Rooms } = require('../../database/models/Room')
// eslint-disable-next-line no-unused-vars
const { Badges } = require('../../database/models/Badge')

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
      // eslint-disable-next-line no-eval
      let evaled = await eval(code)
      evaled = inspect(evaled, { depth: 1 })
      if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`

      message.channel.send(evaled, { code: 'js' })
    } catch (e) {
      message.channel.send(e)
    }
  }
}
