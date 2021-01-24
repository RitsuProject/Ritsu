import Anilist from 'anilist-node'
import AnilistAnime from '../interfaces/AnilistAnime'
const anilist = new Anilist()

export default async function getAnimeData(name: string) {
  const searchResult = await anilist.search('anime', name)
  const animeResult: AnilistAnime = await anilist.media.anime(
    searchResult.media[0].id
  )
  return animeResult
}
