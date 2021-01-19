const { MessageEmbed } = require('discord.js')
const { Constants } = require('../constants')
const { logger } = require('../logger')

/**
 * The Answser Embed generator.
 * @param {String} answer - The answer.
 * @param {String} type - The type.
 * @param {Object} animeData - Details of the anime (cover, title in English, etc.)
 * @param {String} songName - Song Name.
 * @param {Array<String>} songArtists - Song Artists
 * @returns {Promise<MessageEmbed>} Message Embed
 */

module.exports = async function generateEmbed(
  t,
  answer,
  type,
  songName,
  songArtists,
  animeData
) {
  const sendDate = new Date().getTime()
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
    embed.setImage(animeData.image_url)
    embed.setTitle(`${answer} (${type})`)
  } else {
    embed.setDescription(
      "I couldn't get the cover of this anime because of errors."
    )
  }
  embed.setColor(Constants.EMBED_COLOR)
  embed.setFooter(
    t('game:songDetails', {
      songName: songName,
      songArtist: songArtists
        .map((artist) => (artist.name ? artist.name : artist))
        .join(', '),
    })
  )
  const receivedDate = new Date().getTime()
  logger
    .withTag('GAME')
    .info(`Answer Embed took to generate ${receivedDate - sendDate}ms`)
  return embed
}
