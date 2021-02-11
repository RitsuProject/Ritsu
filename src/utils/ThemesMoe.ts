import ThemesMoeAnime from '../interfaces/ThemesMoe'
import RitsuHTTP from '../structures/RitsuHTTP'

export default {
  async getAnimesByAnimeList(website: string, username: string) {
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
      }
      default: {
        throw new Error('Unsupported Website')
      }
    }
  },
}
