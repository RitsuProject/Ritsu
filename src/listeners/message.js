// JSDocs Requires:
// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js')
// eslint-disable-next-line no-unused-vars
const { Ritsu } = require('../client/RitsuClient')

const { captureException } = require('@sentry/node')
const i18next = require('i18next')
const { Guilds } = require('../database/models/Guild')
const { Users } = require('../database/models/User')
const { DiscordLogger } = require('../utils/discordLogger')
const { logger } = require('../utils/logger')

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
    this.client.prometheus.messagesSeen.inc()
    this.client.prometheus.ping.set({}, this.client.ws.ping)
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
      message.content.replace(/!/g, '') ===
      message.guild.me.toString().replace(/!/g, '')
    ) {
      message.channel.send(t('utils:mentionRitsu', { prefix: guild.prefix }))
    }
    if (!message.content.startsWith(guild.prefix)) return
    if (this.client.m)
      return message.channel.send(
        '<a:bongo_cat:772152200851226684> Hey Hey! Sorry for the inconvenience! I am currently undergoing **maintenance**, you can have more news on my support server.'
      )

    if (guild.blacklisted) return

    const args = message.content.slice(guild.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const fancyCommand =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command))
    if (!fancyCommand) return
    const requiredPermissions = fancyCommand.requiredPermissions
    if (message.channel.type === 'dm') return

    if (process.env.VERSION === 'canary') {
      message.channel.send(
        ':warning: **You are using an unstable (and testing) version of Ritsu! This is not recommended and instabilities may occur.**'
      )
    }

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
        logger.withTag('COMMAND HANDLER').error(e)
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
        logger
          .withTag('COMMAND HANDLER')
          .info(
            `Command ${fancyCommand.name} took to run ${
              receivedDate - sendDate
            }ms`
          )
        promTimer({ name: fancyCommand.name })
      })
  }
}
