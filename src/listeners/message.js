const { Users } = require('../models/User')
const { log } = require('../utils/Logger')

module.exports = class Message {
  constructor(client) {
    this.client = client
  }

  async run(message) {
    if (message.author.bot) return
    const user = await Users.findById(message.author.id)
    if(!user) {
      new Users({
        _id: message.author.id,
        name: message.author.tag,
        wonMatches: 0,
        played: 0,
        bio: "",
        admin: false
      }).save()
    }
    if (!message.content.startsWith(this.client.prefix)) return
    const args = message.content
      .slice(this.client.prefix.length)
      .trim()
      .split(/ +/g)
    const command = args.shift().toLowerCase()
    const fancyCommand = this.client.commands.get(command)
    if (!fancyCommand) return
    const requiredPermissions = fancyCommand.requiredPermissions
    if (message.channel.type === 'dm')
      return message.reply('Você não pode executar comandos na DM.')

    if (fancyCommand.dev === true) {
      if (message.author.id !== process.env.BOT_OWNER_ID) {
        return message.reply(
          'You do not have the required permissions to use this command.'
        )
      }
    }
    if (requiredPermissions !== null) {
      if (!message.member.hasPermission(requiredPermissions)) {
        return message.reply(
          'You do not have the required permissions to use this command.'
        )
      }
    }
    try {
      new Promise((resolve) => {
        // eslint-disable-line no-new
        resolve(fancyCommand.run({ message, args }))
      })
    } catch (e) {
      log(`Oopsie! ${e.stack}`, 'COMMAND_HANDLER', true)
      message.reply(
        `Parece que um erro fatal ocorreu, envie uma print dessa mensagem para <@326123612153053184>\n\`${e.stack}\``
      )
    }
  }
}
