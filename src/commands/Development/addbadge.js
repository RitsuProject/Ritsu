// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js')
const { Badges } = require('../../database/models/Badge')
const { Users } = require('../../database/models/User')
const { Command } = require('../../structures/Command')

module.exports = class AddBadge extends Command {
  constructor(client) {
    super(client, {
      name: 'addbadge',
      aliases: [],
      requiredPermissions: null,
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
    const where = args[0]
    const name = args[1]
    const user = args[2]
    const emoji = args[2]
    const type = args[3]
    switch (where) {
      case 'db': {
        if (!name || !emoji || !type)
          return message.channel.send(
            'grrr plz give the a badge the correct values! name, emoji, type (PS: type is rare or normal)'
          )

        const badge = await Badges.findById(name)
        if (!badge) {
          new Badges({
            _id: name,
            name: name,
            emoji: emoji,
            type: type,
            createdBy: message.author.id,
          }).save()
          message.channel.send('owo created!')
        }
        break
      }
      case 'user': {
        if (!name || !user)
          return message.channel.send(
            'plz give the badge name or the ID of the User!'
          )

        const fancyUser = await Users.findById(user)
        const badge = await Badges.findById(name)
        if (!badge || !fancyUser)
          return message.channel.send('oof not found the badge or the user')

        fancyUser.badges.push(name)
        fancyUser.save()
        message.channel.send('owo added!')
        break
      }
      default: {
        message.channel.send('where?')
      }
    }
  }
}
