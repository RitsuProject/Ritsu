export default interface AnilistAnime {
  id: number
  idMal: number
  title: {
    romaji: string
    english: string
    native: string
    userPreferred: string
  }
  format: 'TV' | 'MOVIE' | 'TV_SHORT' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC'
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_COMPLETED' | 'CANCELLED'
  description: string
  startDate: {
    year: number
    month: number
    day: number
  }
  endDate: {
    year: number
    month: number
    day: number
  }
  season: 'SUMMER' | 'WINTER' | 'SPRING' | 'FALL'
  seasonYear: number
  duration: number
  countryOfOrigin: string
  isLicensed: boolean
  source: string
  hashtag: string
  trailer: string
  coverImage: {
    large: string
    medium: string
    small: string
    color: string
  }
  bannerImage: string
  genres: Array<string>
  synonyms?: Array<string>
  averageScore: number
  meanScore: number
  favourites: number
  popularity: number
  trending: number
  siteUrl: string
}
