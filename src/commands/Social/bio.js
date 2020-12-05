const { Users } = require('../../models/User')
const { Command } = require('../../structures/Command')

module.exports = class Bio extends Command {
  constructor(client) {
    super(client, {
      name: 'bio',
      aliases: ['about'],
      description: 'Change your profile bio.',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */
  async run({ message, args }, _, t) {
    const user = await Users.findById(message.author.id)
    if (!user) return

    const bio = args.slice(0).join(' ')
    if (!bio) return message.channel.send(t('commands:bio.noBio'))

    user.bio = bio
    await user.save()
    message.channel.send(t('commands:bio.changedBio'))
  }
}
