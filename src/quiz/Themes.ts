import RitsuHTTP from '../structures/RitsuHTTP'
import randomValueInArray from '../utils/RandomValueInArray'
import GameOptions from '../interfaces/GameOptions'
import randomIntBetween from '../utils/RandomIntBetween'
import MioSong from '../interfaces/MioSong'

export default class Themes {
  async getThemeByMode(gameOptions: GameOptions) {
    const provider = this.getProvider()
    switch (gameOptions.mode) {
      case 'easy': {
        const randomPage = randomIntBetween(0, 3)
        const byPopularityRank = await RitsuHTTP.get(
          `https://api.jikan.moe/v3/top/anime/${randomPage}/bypopularity`
        )

        const animes = byPopularityRank.data.top
        const anime = randomValueInArray(animes)

        const search = await RitsuHTTP.get(
          `${process.env.API_URL}/themes/search?provider=${provider}&value=${anime.title}`
        )

        const songData: MioSong = search.data

        return songData
      }
    }
  }

  getProvider() {
    const providers = ['animethemes', 'openingsmoe']

    const provider: string = randomValueInArray(providers)

    return provider
  }
}
