import Anilist from 'anilist-node'
import JikanSearch from '../../interfaces/JikanSearch'
import RitsuHTTP from '../../structures/RitsuHTTP'
const anilist = new Anilist()

export default async function getAnimeData(name: string, malID: number) {
  // If the API did not specify the malId (openings.moe repository), we will search for the title.
  let jikanMalId: number
  if (!malID) {
    const jikanSearch = await RitsuHTTP.get<JikanSearch>(
      `https://api.jikan.moe/v3/search/anime?q=${name}&orderBy=members&sort=desc`
    )
    jikanMalId = jikanSearch.data.results[0].mal_id
  }

  // Get full data from Anilist
  const anilistSearch = await anilist.searchEntry.anime(null, {
    idMal: malID || jikanMalId,
  })
  const anilistAnime = await anilist.media.anime(anilistSearch.media[0].id)
  return anilistAnime
}
