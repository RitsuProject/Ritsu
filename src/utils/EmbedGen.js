const { MessageEmbed } = require('discord.js')

module.exports = function EmbedGen(answser, type, animeData) {
  const embed = new MessageEmbed()
  if (type.includes('ED')) {
    type = 'Ending'
  } else if (type.includes('OP')) {
    type = 'Opening'
  }
  if (animeData !== undefined) {
    embed.setImage(
      `http://ritsuapi.herokuapp.com/image/answser?name=${encodeURI(
        animeData.englishTitle
      )}&cover=${animeData.picture}&type=${type}`
    )
  } else {
    embed.setDescription(
      "I couldn't get the cover of this anime because of errors."
    )
  }
  embed.setColor('#ff3860')
  embed.setFooter(`Original Title: ${answser}`)
  return embed
}
