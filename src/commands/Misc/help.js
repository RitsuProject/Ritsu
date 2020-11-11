const { MessageEmbed } = require('discord.js')
const { Guilds } = require('../../models/Guild')
const { Command } = require('../../structures/Command')

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'howtoplay'],
      description: 'This command :P',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Message} message
   * @param {Array} args
   */
  async run(message, args, guild) {
    const embed = new MessageEmbed()
    embed.setTitle('Available commands')
    embed.setColor('#3486eb')
    embed.setDescription(
      '**How to Play**: When using the command to start the game, the bot will play a song from a random opening or ending (or if you specify the year of the themes in the start command) and whoever can guess the anime from the largest number of openings or endings according to the rounds , wins.'
    )
    embed.addField('Commands', this.getCommands(guild.prefix))

    message.channel.send(embed)
  }

  getCommands(prefix) {
    // Get all the commands and format them using the server prefix.
    return this.client.commands
      .filter((c) => !c.dev)
      .map(
        (c) =>
          `\`${prefix}${c.name} ${
            c.fields === null
              ? ''
              : `${c.fields.map((f) => `<${f}>`).join(' ')}`
          }\` - ${c.description}`
      )
      .join('\n ')
  }
}
