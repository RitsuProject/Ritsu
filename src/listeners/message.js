const { captureException } = require('@sentry/node')
const { Message } = require('discord.js')
const i18next = require('i18next')
const { Guilds } = require('../models/Guild')
const { Users } = require('../models/User')
const { Ritsu } = require('../Ritsu')
const { DiscordLogger } = require('../utils/discordLogger')
const { log } = require('../utils/Logger')

module.exports = class message {
  /**
   *
   * @param {Ritsu} client
   */
  constructor(client) {
    this.client = client
  }
  async run(message) {
    if (message.author.bot) return
    const user = await Users.findById(message.author.id)
    const guild = await Guilds.findById(message.guild.id)
    if (!guild) {
      const guild_ = new Guilds({
        _id: message.guild.id,
        name: message.guild.name,
        rolling: false,
        currentChannel: null,
        premium: false,
      })
      await guild_.save()
    }
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
    const promTimer = this.client.prometheus.commandLatency.startTimer()
    const sendDate = new Date().getTime()
    this.client.prometheus.commandCounter.labels(fancyCommand.name).inc()

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
    new Promise((resolve) => {
      // eslint-disable-line no-new
      resolve(fancyCommand.run({ message, args }, guild, t))
    })
      .catch((e) => {
        log(`Oopsie! ${e.stack}`, 'COMMAND_HANDLER', true)
        message.reply(
          `<a:bongo_cat:772152200851226684> | ${t('game:errors.fatalError', {
            error: `\`${e}\``,
          })}`
        )
        captureException(e)
        this.client.prometheus.errorCounter.inc()
      })
      .then(() => {
        const receivedDate = new Date().getTime()
        log(
          `Command ${fancyCommand.name} took to run ${
            receivedDate - sendDate
          }ms`,
          'COMMAND_HANDLER',
          false
        )
        promTimer({ name: fancyCommand.name })
      })
  }
}
