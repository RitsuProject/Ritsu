const { Client, Collection } = require('discord.js')
const { readdir } = require('fs')
const connect = require('./db')
const { log } = require('./utils/Logger')

/**
 * Ritsu Client
 * @class
 * @param {String} token - Discord Token
 * @param {Object} options - Client Options
 */
module.exports.Ritsu = class Ritsu extends Client {
  constructor(token, options) {
    super(token)
    this.token = token
    this.prefix = options.prefix
    this.owners = [
      '722539264067240097',
      '326123612153053184',
      '565951284373487637',
    ]
    this.commands = new Collection()
    this.aliases = new Collection()
  }

  async start() {
    this.loadListeners()
    log('Loaded Listeners', 'MAIN', false)
    this.loadCommands()
    log('Loaded Commands', 'MAIN', false)
    connect()

    process.on('SIGTERM', () => {
      this.destroy()
      process.exit(0)
    })

    this.login(this.token).then(() => {
      log('Logged', 'MAIN', false)
    })
  }

  loadCommands() {
    readdir(`${__dirname}/commands`, (err, files) => {
      if (err) console.error(err)
      files.forEach((category) => {
        readdir(`${__dirname}/commands/${category}`, (err, cmd) => {
          if (err) return console.log(err)
          cmd.forEach((cmd) => {
            const command = new (require(`${__dirname}/commands/${category}/${cmd}`))(
              this
            )
            command.dir = `./src/commands/${category}/${cmd}`
            this.commands.set(command.name, command)
            command.aliases.forEach((a) => this.aliases.set(a, command.name))
          })
        })
      })
    })
  }

  loadListeners() {
    readdir(`${__dirname}/listeners`, (err, files) => {
      if (err) console.error(err)
      files.forEach(async (em) => {
        const Event = require(`${__dirname}/listeners/${em}`)
        const eventa = new Event(this)
        const name = em.split('.')[0]
        super.on(name, (...args) => eventa.run(...args))
      })
    })
  }
}
