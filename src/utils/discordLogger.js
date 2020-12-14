// eslint-disable-next-line no-unused-vars
const { Client, MessageEmbed } = require('discord.js')
const { Constants } = require('./constants')

module.exports.DiscordLogger = class DiscordLogger {
  /**
   * Constructor
   * @param {Client} client
   */
  constructor(client) {
    this.client = client
  }

  async logCommand(command, author, server) {
    const authorUser = this.client.users.cache.get(author)
    const guild = this.client.guilds.cache.get(server)
    const embed = new MessageEmbed()
    embed.setAuthor(authorUser.username, authorUser.displayAvatarURL())
    embed.setColor(Constants.EMBED_COLOR)
    embed.setTitle('Command Executed')
    embed.addField('Command:', `**${command}**`)
    embed.addField('Author:', `${authorUser.tag} (${authorUser.id})`)
    embed.addField('Server:', `${guild.name} (${guild.id})`)
    embed.setTimestamp()

    this.client.channels.cache.get(Constants.LOG_CHANNEL).send(embed)
  }

  async logMatch(rounds, time, host, mode, server) {
    const hostUser = this.client.users.cache.get(host)
    const guild = this.client.guilds.cache.get(server)
    const embed = new MessageEmbed()
    embed.setAuthor(hostUser.username, hostUser.displayAvatarURL())
    embed.setColor(Constants.EMBED_COLOR)
    embed.setTitle('Match Started')
    embed.addField('Host:', `${hostUser.tag} (${hostUser.id})`)
    embed.addField('Rounds:', `**${rounds}**`)
    embed.addField('Each Round Duration:', `**${time}**`)
    embed.addField('Gamemode:', `**${mode}**`)
    embed.addField('Server:', `${guild.name} (${guild.id})`)
    embed.setTimestamp()

    this.client.channels.cache.get(Constants.LOG_CHANNEL).send(embed)
  }

  async logError(error, author, server) {
    const authorUser = this.client.users.cache.get(author)
    const guild = this.client.guilds.cache.get(server)
    const embed = new MessageEmbed()
    embed.setAuthor(authorUser.username, authorUser.displayAvatarURL())
    embed.setColor(Constants.EMBED_COLOR)
    embed.setTitle('Error Detected')
    embed.setDescription(`\`\`\`diff\n${error}\`\`\``)
    embed.addField('Author:', `${authorUser.tag} (${authorUser.id})`)
    embed.addField('Server:', `${guild.name} (${guild.id})`)
    embed.setTimestamp()

    this.client.channels.cache.get(Constants.LOG_CHANNEL).send(embed)
  }
}
