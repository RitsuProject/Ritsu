import { AnimeEntry } from 'anilist-node'
import MioSong from '@interfaces/MioSong'
import Vibrant from 'node-vibrant/lib/index'
import Constants from '@utils/Constants'

export default async function generateAnswerEmbed(
  theme: MioSong,
  animeData: AnimeEntry
) {
  // Get the vibrant color from the anime cover image
  const ImageColor = await Vibrant.from(
    animeData.coverImage.medium
  ).getPalette()
  const imageColorHex = ImageColor.Vibrant.hex.replace('#', '')
  const imageColorAndroid = parseInt(imageColorHex, 16)

  // Remove all the <i></i> and <br> tags.
  const synopsis =
    animeData.description.length > 100
      ? animeData.description
          .replace(Constants.REMOVE_HTML_TAGS, '')
          .substring(0, 250 - 3) + '...'
      : animeData.description.replace(Constants.REMOVE_HTML_TAGS, '')

  const alternateTitles = `${animeData.title.romaji}\n${animeData.title.native}`
  const synonyms =
    animeData.synonyms && animeData.synonyms.length > 1
      ? animeData.synonyms.map((s) => s).join('\n ')
      : ''

  // Sometimes, the anime title in english is null.
  const embedTitle = animeData.title.english
    ? animeData.title.english
    : animeData.title.romaji

  const embed = {
    title: `${embedTitle} (${theme.type})`,
    description: `${synopsis}`,
    fields: [
      { name: 'Anime Season', value: `${animeData.season}`, inline: true },
      { name: 'Year', value: `${animeData.seasonYear}`, inline: true },
      {
        name: 'Titles & Synonyms',
        value: `${alternateTitles}\n${synonyms}`,
        inline: true,
      },
    ],
    image: { url: animeData.coverImage.large },
    color: imageColorAndroid,
    footer: {
      text: `${theme.songName} | Artist(s): None`,
    },
  }

  return embed
}
