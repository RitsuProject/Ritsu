const { MessageEmbed } = require('discord.js')
const { Constants } = require('../constants')

/**
 * The Answser Embed generator.
 * @param {String} answser - The answer.
 * @param {String} type - The type.
 * @param {Object} animeData - Details of the anime (cover, title in English, etc.)
 * @returns {MessageEmbed} Message Embed
 */

module.exports = function EmbedGen(answser, type, animeData) {
  const embed = new MessageEmbed()
  if (type.includes('ED')) {
    type = 'Ending'
  } else if (type.includes('OP')) {
    type = 'Opening'
  }
  if (animeData !== undefined) {
    embed.setImage(
      `${process.env.API_URL}/image/answser?name=${encodeURI(
        animeData.englishTitle ? animeData.englishTitle : answser
      )}&cover=${animeData.picture}&type=${encodeURI(type)}`
    )
  } else {
    embed.setDescription(
      "I couldn't get the cover of this anime because of errors."
    )
  }
  embed.setColor(Constants.EMBED_COLOR)
  embed.setFooter(`Original Title: ${answser}`)
  return embed
}
