export default interface GameOptions {
  mode: 'easy' | 'normal' | 'hard' | 'season' | 'list'
  rounds: number
  time: number
  readableTime: string

  listWebsite?: 'anilist' | 'myanimelist'
  listUsername?: string

  year?: string
  season?: 'winter' | 'spring' | 'summer' | 'fall'
}
