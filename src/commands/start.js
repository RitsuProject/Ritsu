const { Guilds } = require('../models/Guild')
const { GameService } = require('../services/GameService')
const { Command } = require('../structures/Command')

module.exports = class Start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      aliases: [],
      requiredPermissions: null,
      dev: false,
    })
  }

  async run({ message, args }) {
    const guild = await Guilds.findById(message.guild.id)
    if(guild.rolling) return message.channel.send("There is already a match running on a voice channel on that server.")
    
    const gameService = new GameService(message, {
      year: `${args[1] ? args[1] : 'random'}`,
      rounds: `${args[0] ? args[0] : "3"}`
    })
    gameService.init()
  }
}
