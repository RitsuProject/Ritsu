import Anilist from 'anilist-node'
import JikanSearch from '../../interfaces/JikanSearch'
import RitsuHTTP from '../../structures/RitsuHTTP'
const anilist = new Anilist()

export default async function getAnimeData(name: string) {
  // Get initial data from MAL
  const malSearch = await RitsuHTTP.get<JikanSearch>(
    `https://api.jikan.moe/v3/search/anime?q=${name}&orderBy=members&sort=desc`
  )

  // Get full data from Anilist
  const anilistSearch = await anilist.searchEntry.anime(null, {
    idMal: malSearch.data.results[0].mal_id,
  })
  const anilistAnime = await anilist.media.anime(anilistSearch.media[0].id)
  return anilistAnime
}
