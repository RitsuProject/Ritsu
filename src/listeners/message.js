const { Message } = require('discord.js')
const i18next = require('i18next')
const { Guilds } = require('../models/Guild')
const { Users } = require('../models/User')
const { DiscordLogger } = require('../utils/discordLogger')
const { log } = require('../utils/Logger')

module.exports = class message {
  constructor(client) {
    this.client = client
  }
  async run(message) {
    if (message.author.bot) return
    const user = await Users.findById(message.author.id)
    const guild = await Guilds.findById(message.guild.id)
    if (!user) {
      // Create a user in the database
      new Users({
        _id: message.author.id,
        name: message.author.tag,
        wonMatches: 0,
        played: 0,
        rank: 'Beginner',
        bio: '',
        admin: false,
      }).save()
    }

    const t = i18next.getFixedT(guild.lang)

    if (
      message.content.replace(/!/g, '') ==
      message.guild.me.toString().replace(/!/g, '')
    ) {
      message.channel.send(t('utils:mentionRitsu', { prefix: guild.prefix }))
    }
    if (!message.content.startsWith(guild.prefix)) return
    const args = message.content.slice(guild.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const fancyCommand =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command))
    if (!fancyCommand) return
    const requiredPermissions = fancyCommand.requiredPermissions
    if (message.channel.type === 'dm') return

    const discordLogger = new DiscordLogger(this.client)
    await discordLogger.logCommand(command, message.author.id, message.guild.id)

    if (fancyCommand.dev === true) {
      if (!this.client.owners.includes(message.author.id)) {
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
        resolve(fancyCommand.run({ message, args }, guild, t))
      })
    } catch (e) {
      log(`Oopsie! ${e.stack}`, 'COMMAND_HANDLER', true)
      message.reply(
        `Oopsie! A fatal error, report this to <@326123612153053184>\n\`${e.stack}\``
      )
    }
  }
}
