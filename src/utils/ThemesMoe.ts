import { ThemesMoeAnime } from '@interfaces/ThemesMoe'
import RitsuHTTP from '@structures/RitsuHTTP'
import RitsuUtils from '@utils/RitsuUtils'

export default {
  async getAnimesByAnimeList(
    website: string,
    username: string,
    themeType?: string // Why is this a optional parameter? Well, sometimes this function is called just to check if a username is really valid, so, no need to specify a theme type.
  ): Promise<ThemesMoeAnime[]> {
    switch (website) {
      case 'mal': {
        try {
          const themesMoeResponse = await RitsuHTTP.get<ThemesMoeAnime[]>(
            `https://themes.moe/api/mal/${username}`
          )

          const themeTypeFormated =
            themeType === 'openings'
              ? 'OP'
              : themeType === 'endings'
              ? 'ED'
              : 'both'

          // Get only watched animes (which has watchStatus 2) and with themes that has the theme type specified (if is both, just select any)
          const animes = themesMoeResponse.data.filter(
            (anime) =>
              anime.watchStatus === 2 &&
              anime.themes.some((theme) =>
                themeTypeFormated !== 'both'
                  ? theme.themeType.includes(themeTypeFormated)
                  : true
              )
          )

          if (animes.length > 0) {
            return animes
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(`${e}`)
          }
        }
        break
      }
      case 'anilist': {
        try {
          const themesMoeResponse = await RitsuHTTP.get<ThemesMoeAnime[]>(
            `https://themes.moe/api/anilist/${username}`
          )

          const themeTypeFormated =
            themeType === 'openings'
              ? 'OP'
              : themeType === 'endings'
              ? 'ED'
              : 'both'

          // Get only watched animes (which has watchStatus 2) and with themes that has the theme type specified (if is both, just select any)
          const animes = themesMoeResponse.data.filter(
            (anime) =>
              anime.watchStatus === 2 &&
              anime.themes.some((theme) =>
                themeTypeFormated !== 'both'
                  ? theme.themeType.includes(themeTypeFormated)
                  : true
              )
          )

          if (animes.length > 0) {
            return animes
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(`${e}`)
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
    season: string,
    themeType: string
  ): Promise<ThemesMoeAnime[]> {
    try {
      const themesMoeResponse = await RitsuHTTP.get<ThemesMoeAnime[]>(
        `https://themes.moe/api/seasons/${year}`
      )

      const themeTypeFormated =
        themeType === 'openings'
          ? 'OP'
          : themeType === 'endings'
          ? 'ED'
          : 'both'

      // Get only watched animes (which has watchStatus 2) and with themes that has the theme type specified (if is both, just select any)
      // In this case, also filter by the specified anime season.
      const animes = themesMoeResponse.data.filter(
        (anime) =>
          anime.watchStatus === 2 &&
          anime.themes.some((theme) =>
            themeTypeFormated !== 'both'
              ? theme.themeType.includes(themeTypeFormated)
              : true
          ) &&
          anime.season === season
      )

      if (animes.length > 0) return animes

      throw new Error('Season not found.')
    } catch (e) {
      if (RitsuUtils.isAxiosError(e)) {
        if (e.response.status === 404) throw new Error('Year not found.')
      } else {
        throw new Error(`${e}`)
      }
    }
  },
}
