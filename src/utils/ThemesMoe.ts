import { ThemesMoeAnime } from '../interfaces/ThemesMoe'
import RitsuHTTP from '../structures/RitsuHTTP'

export default {
  async getAnimesByAnimeList(
    website: string,
    username: string
  ): Promise<ThemesMoeAnime[]> {
    switch (website) {
      case 'mal': {
        try {
          const themesMoeResponse = await RitsuHTTP.get(
            `https://themes.moe/api/mal/${username}`
          )

          const data: Array<ThemesMoeAnime> = themesMoeResponse.data

          if (data.length > 0) {
            return data
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (e.isAxiosError) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(e.message)
          }
        }
        break
      }
      case 'anilist': {
        try {
          const themesMoeResponse = await RitsuHTTP.get(
            `https://themes.moe/api/anilist/${username}`
          )

          const data: Array<ThemesMoeAnime> = themesMoeResponse.data

          if (data.length > 0) {
            return data
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (e.isAxiosError) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(e.message)
          }
        }
        break
      }
      default: {
        throw new Error('Unsupported Website')
      }
    }
  },

  async getAnimesBySeason(
    year: string,
    season: string
  ): Promise<ThemesMoeAnime[]> {
    try {
      const themesMoeResponse = await RitsuHTTP.get(
        `https://themes.moe/api/seasons/${year}`
      )

      const data: Array<ThemesMoeAnime> = themesMoeResponse.data
      const filter = data.filter((anime) => anime.season === season)

      if (filter.length > 0) return filter

      throw new Error('Season not found.')
    } catch (e) {
      if (e.isAxiosError) {
        if (e.response.status === 404) throw new Error('Year not found.')
      } else {
        throw new Error(e.message)
      }
    }
  },
}
