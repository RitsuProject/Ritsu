import Anilist from 'anilist-node'
const anilist = new Anilist()

export default async function getAnimeData(name: string) {
  const searchResult = await anilist.search('anime', name)
  console.log(searchResult)
  if (searchResult.pageInfo.total <= 0)
    throw new Error('Anime in Anilist Not Found!')
  const animeResult = await anilist.media.anime(searchResult.media[0].id)
  return animeResult
}
