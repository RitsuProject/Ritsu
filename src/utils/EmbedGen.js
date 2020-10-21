const { MessageEmbed } = require('discord.js')

module.exports = function EmbedGen(answser, type, animeData) {
  const embed = new MessageEmbed()
  if (animeData !== undefined) {
    embed.setImage(animeData.picture)
  } else {
    embed.setDescription(
      "I couldn't get the cover of this anime because of errors."
    )
  }
  embed.setTitle(answser)
  embed.setColor('#33e83c')
  embed.setFooter(
    `Type: ${type} ${
      animeData.englishTitle != '' ? `| English: ${animeData.englishTitle}` : ''
    }`
  )
  return embed
}
