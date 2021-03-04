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
      let evaluated = await eval(code)
      evaluated = inspect(evaluated, { depth: 1 })
      if (evaluated.length > 1800) evaluated = `${evaluated.slice(0, 1800)}...`

      message.channel.send(evaluated, { code: 'js' })
    } catch (e) {
      message.channel.send(e)
    }
  }
}
