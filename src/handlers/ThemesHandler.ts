import RitsuHTTP from '@structures/RitsuHTTP'
import GameOptions from '@interfaces/GameOptions'
import MioSong from '@interfaces/MioSong'
import JikanAnime from '@interfaces/jikan/JikanAnime'
import RitsuUtils from '@utils/RitsuUtils'
import NodeCache from 'node-cache'
import { Message } from 'eris'
import ThemesMoe from '@utils/ThemesMoe'
import RepositoryStatus from '@interfaces/RepositoryStatus'
import UnreachableRepository from '@structures/errors/UnreachableRepository'

/**
 * ThemesHandler
 * @description Handle the process of fetching the themes according to the mode.
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
    const repository = this.getRepository()
    const isRepositoryOnline =
      this.gameOptions.mode === 'season' || this.gameOptions.mode === 'list'
        ? await this.isRepositoryOnline('animethemes')
        : await this.isRepositoryOnline(repository)
    if (!isRepositoryOnline) throw new UnreachableRepository(repository)

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
            `${
              process.env.API_URL
            }/themes/${repository}/search?title=${encodeURI(
              anime.title
            )}&malId=${anime.mal_id}&type=${this.gameOptions.themeType}`
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
                `${process.env.API_URL}/themes/${repository}/random&type=${this.gameOptions.themeType}`
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
                `${
                  process.env.API_URL
                }/themes/${repository}/search?title=${encodeURI(
                  anime.title
                )}&malId=${anime.mal_id}&type=${this.gameOptions.themeType}`
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
          this.gameOptions.animeListUsername,
          this.gameOptions.themeType
        )

        const anime = RitsuUtils.randomValueInArray(animeList)

        const themeTypeFormated =
          this.gameOptions.themeType === 'openings'
            ? 'OP'
            : this.gameOptions.themeType === 'endings'
            ? 'ED'
            : 'both'

        const themes = anime.themes.filter((theme) =>
          themeTypeFormated !== 'both'
            ? theme.themeType.includes(themeTypeFormated)
            : true
        )
        const theme = RitsuUtils.randomValueInArray(themes)

        const mioSongFakeObject = {
          malId: anime.malID,
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
            this.gameOptions.season,
            this.gameOptions.themeType
          )

          const anime = RitsuUtils.randomValueInArray(animes)
          const theme = RitsuUtils.randomValueInArray(anime.themes)

          const mioSongFakeObject = {
            malId: anime.malID,
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
    const chosenTheme = await this.chooseTheme()
    this.themesCache.set(chosenTheme.link, this.message.guildID)

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

  getRepository(): string {
    const repositories = ['animethemes', 'openingsmoe']

    const repository = RitsuUtils.randomValueInArray(repositories)

    return repository
  }

  async isRepositoryOnline(repository: string): Promise<boolean> {
    const fetchedStatus = await RitsuHTTP.get<RepositoryStatus>(
      `${process.env.API_URL}/themes/status`
    )
    const statuses = fetchedStatus.data

    switch (repository) {
      case 'animethemes': {
        return statuses.animethemes === 'online'
      }
      case 'openingsmoe': {
        return statuses.openingsmoe === 'online'
      }
    }
  }
}
