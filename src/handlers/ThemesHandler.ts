import RitsuHTTP from '../structures/RitsuHTTP'
import GameOptions from '../interfaces/GameOptions'
import MioSong from '../interfaces/MioSong'
import JikanAnime from '../interfaces/JikanAnime'
import RitsuUtils from '../utils/RitsuUtils'
import NodeCache from 'node-cache'
import { Message } from 'eris'
import ThemesMoe from '../utils/ThemesMoe'

/**
 * ThemesHandler
 * @description Pick up the themes of the openings and endings according to the game mode.
 */
export default class ThemesHandler {
  constructor(
    private message: Message,
    private gameOptions: GameOptions,
    private themesCache: NodeCache
  ) {
    this.gameOptions = gameOptions
    this.themesCache = themesCache
  }

  async getThemeByMode(): Promise<false | MioSong> {
    const provider = this.getProvider()
    switch (this.gameOptions.mode) {
      case 'easy': {
        try {
          const randomPage = RitsuUtils.randomIntBetween(0, 3)
          const byPopularityRank = await RitsuHTTP.get<JikanAnime>(
            `https://api.jikan.moe/v3/top/anime/${randomPage}/bypopularity`
          )

          const animes = byPopularityRank.data.top
          const anime = RitsuUtils.randomValueInArray(animes)

          const search = await RitsuHTTP.get<MioSong>(
            `${process.env.API_URL}/themes/search?provider=${provider}&value=${anime.title}`
          )

          const songData = search.data

          return songData
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) return false
          } else {
            throw new Error(`${e}`)
          }
        }
        break
      }
      case 'normal': {
        try {
          const types = ['random', 'popularity']
          const type = RitsuUtils.randomValueInArray(types)

          switch (type) {
            case 'random': {
              const random = await RitsuHTTP.get<MioSong>(
                `${process.env.API_URL}/themes/random?provider=${provider}`
              )

              const songData = random.data

              return songData
            }
            case 'popularity': {
              const randomPage = RitsuUtils.randomIntBetween(0, 5)

              const byPopularityRank = await RitsuHTTP.get<JikanAnime>(
                `https://api.jikan.moe/v3/top/anime/${randomPage}/bypopularity`
              )

              const animes = byPopularityRank.data.top
              const anime = RitsuUtils.randomValueInArray(animes)

              const search = await RitsuHTTP.get<MioSong>(
                `${process.env.API_URL}/themes/search?provider=${provider}&value=${anime.title}`
              )

              const songData = search.data

              return songData
            }
          }
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) return false
          } else {
            throw new Error(`${e}`)
          }
        }
        break
      }

      case 'list': {
        const animeList = await ThemesMoe.getAnimesByAnimeList(
          this.gameOptions.animeListWebsite,
          this.gameOptions.animeListUsername
        )

        const anime = RitsuUtils.randomValueInArray(animeList)
        const theme = RitsuUtils.randomValueInArray(anime.themes)

        const mioSongFakeObject = {
          name: anime.name,
          link: theme.mirror.mirrorURL,
          type: `${theme.themeType.includes('OP') ? 'OP' : 'ED'}`,
          songName: theme.themeName,
          songArtists: ['Not available in this game mode.'],
        }

        return mioSongFakeObject
      }

      case 'season': {
        try {
          const animes = await ThemesMoe.getAnimesBySeason(
            this.gameOptions.year,
            this.gameOptions.season
          )

          const anime = RitsuUtils.randomValueInArray(animes)
          const theme = RitsuUtils.randomValueInArray(anime.themes)

          const mioSongFakeObject = {
            name: anime.name,
            link: theme.mirror.mirrorURL,
            type: `${theme.themeType.includes('OP') ? 'OP' : 'ED'}`,
            songName: theme.themeName,
            songArtists: ['Not available in this game mode.'],
          }

          return mioSongFakeObject
        } catch (e) {
          console.log(e)
          throw new Error(`${e}`)
        }
      }

      default: {
        throw new Error('Gamemode not found.')
      }
    }
  }

  async getTheme(): Promise<MioSong> {
    const loadingMessage = await this.message.channel.createMessage(
      `\`Fetching the Anime Theme...\``
    )

    const chosenTheme = await this.chooseTheme()
    this.themesCache.set(chosenTheme.link, this.message.guildID)
   
    void loadingMessage.delete()
    return chosenTheme
  }

  async chooseTheme(): Promise<MioSong> {
    const theme = await this.getThemeByMode()

    if (!theme || this.themesCache.get(theme.link) !== undefined) {
      return await this.chooseTheme()
    } else {
      return theme
    }
  }

  getProvider() {
    const providers = ['animethemes', 'openingsmoe']

    const provider = RitsuUtils.randomValueInArray(providers)

    return provider
  }
}
