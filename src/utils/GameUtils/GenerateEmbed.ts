import { AnimeEntry } from 'anilist-node'
import MioSong from '../../interfaces/MioSong'

export default function generateEmbed(theme: MioSong, animeData: AnimeEntry) {
  const embed = {
    title: `${animeData.title.romaji} (${theme.type})`,
    image: { url: animeData.coverImage.medium },
    color: 3442411,
    footer: {
      text: `${theme.songName} | Artist(s): None`,
    },
  }

  return embed
}
