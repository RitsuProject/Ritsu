import RitsuHTTP from '../structures/RitsuHTTP'
import randomValueInArray from '../utils/RandomValueInArray'
import GameOptions from '../interfaces/GameOptions'
import randomIntBetween from '../utils/RandomIntBetween'
import MioSong from '../interfaces/MioSong'

/**
 * Themes
 * @description Pick up the themes of the openings and endings according to the game mode.
 */
export default class Themes {
  async getThemeByMode(gameOptions: GameOptions) {
    const provider = this.getProvider()
    switch (gameOptions.mode) {
      case 'easy': {
        try {
          const randomPage = randomIntBetween(0, 9)
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
        } catch (e) {
          if (e.isAxiosError) {
            if (e.response.status === 400) return false
          } else {
            throw new Error(e.message)
          }
        }
      }
      case 'normal': {
        try {
          const types = ['random', 'popularity']
          const type: string = randomValueInArray(types)

          switch (type) {
            case 'random': {
              const random = await RitsuHTTP.get(
                `${process.env.API_URL}/themes/random?provider=${provider}`
              )

              const songData: MioSong = random.data

              return songData
            }
            case 'popularity': {
              const randomPage = randomIntBetween(0, 5)

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
        } catch (e) {
          if (e.isAxiosError) {
            if (e.response.status === 400) return false
          } else {
            throw new Error(e.message)
          }
        }
      }
      default: {
        throw new Error('Gamemode not found.')
      }
    }
  }

  getProvider() {
    const providers = ['animethemes', 'openingsmoe']

    const provider: string = randomValueInArray(providers)

    return provider
  }
}
