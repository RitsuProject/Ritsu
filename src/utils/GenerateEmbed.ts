import { Embed, EmbedOptions } from 'eris'
import AnilistAnime from '../interfaces/AnilistAnime'
import MioSong from '../interfaces/MioSong'

export default function generateEmbed(theme: MioSong, animeData: AnilistAnime) {
  const embed: EmbedOptions = {
    title: `${animeData.title.romaji} (${theme.type})`,
    image: { url: animeData.coverImage.medium },
    color: 3442411,
    footer: {
      text: `${theme.songName} | Artist(s): None`,
    },
  }

  return embed
}
