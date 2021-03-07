/* eslint-disable camelcase */
interface JikanAnimeSearch {
  mal_id: number
  url: string
  image_url: string
  title: string
  airing: boolean
  synopsis: string
  type: string
  episodes: number
  score: number
  start_date: string
  end_date: string
  members: number
  rated: string
}

export default interface JikanSearch {
  results: JikanAnimeSearch[]
}
