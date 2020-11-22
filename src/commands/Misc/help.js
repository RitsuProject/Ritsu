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
   * @param {Object} run
   * @param {Message} run.message
   */
  async run({ message }, guild, t) {
    const embed = new MessageEmbed()
    embed.setTitle(t('commands:help.available'))
    embed.setColor('#3486eb')
    embed.setDescription(t('commands:help.howtoplay'))
    embed.addField(
      t('commands:botinfo.commands'),
      this.getCommands(guild.prefix, t)
    )

    message.channel.send(embed)
  }

  getCommands(prefix, t) {
    // Get all the commands and format them using the server prefix.
    return this.client.commands
      .filter((c) => !c.dev)
      .map(
        (c) =>
          `\`${prefix}${c.name} ${
            c.fields === null
              ? ''
              : `${c.fields.map((f) => `<${f}>`).join(' ')}`
          }\` - ${t(`commands:${c.name}.helpDescription`)}`
      )
      .join('\n ')
  }
}
