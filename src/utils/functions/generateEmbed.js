const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Constants } = require('../constants')
const { getAnswerCard } = require('./getAnswerCard')

/**
 * The Answser Embed generator.
 * @param {String} answer - The answer.
 * @param {String} type - The type.
 * @param {Object} animeData - Details of the anime (cover, title in English, etc.)
 * @param {String} songName - Song Name.
 * @param {Array<String>} songArtists - Song Artists
 * @returns {Promise<MessageEmbed>} Message Embed
 */

module.exports = async function EmbedGen(
  t,
  answer,
  type,
  songName,
  songArtists,
  animeData
) {
  const embed = new MessageEmbed()
  if (type.includes('ED')) {
    type = 'Ending'
  } else if (type.includes('OP')) {
    type = 'Opening'
  }
  if (animeData !== undefined) {
    /*  const cardBuffer = await getAnswerCard(animeData, answer, type)
    const attachment = new MessageAttachment(cardBuffer, 'card.png')
    embed.attachFiles(attachment)
    embed.setImage('attachment://card.png') */
    embed.setImage(animeData.picture)
    embed.setTitle(answer)
  } else {
    embed.setDescription(
      "I couldn't get the cover of this anime because of errors."
    )
  }
  embed.setColor(Constants.EMBED_COLOR)
  console.log(songArtists)
  embed.setFooter(
    t('game:songDetails', {
      songName: songName,
      songArtist: songArtists
        .map((artist) => (artist.name ? artist.name : artist))
        .join(', '),
    })
  )
  return embed
}
