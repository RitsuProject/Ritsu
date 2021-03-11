import { AnimeEntry } from 'anilist-node'
import MioSong from '../../interfaces/MioSong'
import Vibrant from 'node-vibrant/lib/index'

export default async function generateEmbed(
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
  const removeTagsRegex = '/(<br>|<i>|</i>)/g'
  const synopsis =
    animeData.description.length > 100
      ? animeData.description
          .replace(removeTagsRegex, '')
          .substring(0, 250 - 3) + '...'
      : animeData.description.replace(removeTagsRegex, '')

  const synonyms =
    animeData.synonyms && animeData.synonyms.length > 1
      ? animeData.synonyms.map((s) => s).join('\n ')
      : 'None'

  const embed = {
    title: `${animeData.title.romaji} (${theme.type})`,
    description: `${synopsis}`,
    fields: [
      { name: 'Anime Season', value: `${animeData.season}`, inline: true },
      { name: 'Year', value: `${animeData.seasonYear}`, inline: true },
      { name: 'Synonyms', value: synonyms, inline: true },
    ],
    image: { url: animeData.coverImage.medium },
    color: imageColorAndroid,
    footer: {
      text: `${theme.songName} | Artist(s): None`,
    },
  }

  return embed
}
