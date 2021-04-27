const p = require('phin')
const { ThemesMoeAPI } = require('../../rest/ThemesMoeAPI')
const getProviderStatus = require('../../utils/functions/getProviderStatus')
const { getVideoUrl } = require('../../utils/functions/getVideoUrl')
const { randomInt } = require('../../utils/functions/randomInt')

/**
 * Service responsible for extracting themes from Ritsu API/MAL API.
 * @class
 */

module.exports.Themes = class Themes {
  async getAnimeByMode(
    provider,
    mode,
    listService,
    listUsername,
    year,
    season
  ) {
    const status = await getProviderStatus(provider)
    if (!status) return 'unavailable'
    switch (mode) {
      case 'easy': {
        const randomPage = randomInt(1, 3)
        const rank = await p({
          method: 'GET',
          url: `https://api.jikan.moe/v3/top/anime/${randomPage}/bypopularity`,
          parse: 'json',
        })

        const animes = rank.body.top
        const anime = animes[Math.floor(Math.random() * animes.length)]

        const search = await p({
          method: 'GET',
          url: `${process.env.API_URL}/themes/${provider}/search?title=${anime.title}&malId=${anime.mal_id}`,
          parse: 'json',
          timeout: 20000,
        }).catch(() => {
          throw new Error(
            "I couldn't find any theme! Perhaps this is due to instability? Please restart the match."
          )
        })
        if (search.statusCode === 200) {
          return search.body
        } else if (search.body.err === 'no_anime') {
          return false
        } else {
          throw new Error(
            `The API returned a status code that is not 200! | Code: ${search.statusCode}`
          )
        }
      }
      case 'normal': {
        const random = await p({
          method: 'GET',
          url: `${process.env.API_URL}/themes/${provider}/random`,
          parse: 'json',
        })

        if (random.statusCode === 200) {
          return random.body
        } else {
          throw new Error(
            `The API returned a status code that is not 200! | Code: ${random.statusCode}`
          )
        }
      }
      case 'hard': {
        const hardYears = [
          '2000',
          '2001',
          '2002',
          '2003',
          '2004',
          '2005',
          '2006',
          '2007',
          '2008',
          '2009',
          '2010',
        ]

        const year = hardYears[Math.floor(Math.random() * hardYears.length)]

        const search = await p({
          method: 'GET',
          url: `${process.env.API_URL}/themes/animethemes/perYear?year=${year}`,
          parse: 'json',
        })
        if (search.statusCode === 200) {
          return search.body
        } else if (search.body.err === 'no_anime') {
          return false
        } else {
          throw new Error(
            `The API returned a status code that is not 200! | Code: ${search.statusCode}`
          )
        }
      }
      case 'list': {
        const themesMoe = new ThemesMoeAPI()
        let userAnimes
        if (listService === 'mal') {
          userAnimes = await themesMoe.getAnimesByMal(listUsername)
        } else if (listService === 'anilist') {
          userAnimes = await themesMoe.getAnimesByAnilist(listUsername)
        }
        const anime = userAnimes[Math.floor(Math.random() * userAnimes.length)]
        const theme =
          anime.themes[Math.floor(Math.random() * anime.themes.length)]

        const videoUrl = getVideoUrl(theme.mirror.mirrorURL)

        return {
          name: anime.name,
          link: videoUrl,
          type: `${theme.themeType.includes('OP') ? 'OP' : 'ED'}`,
          songName: theme.themeName,
          songArtists: ['Not Found'],
        }
      }
      case 'season': {
        const themesMoe = new ThemesMoeAPI()
        const animes = await themesMoe.getAnimesPerSeason(year, season)
        if (animes.length < 0) return false
        const anime = animes[Math.floor(Math.random() * animes.length)]
        const theme =
          anime.themes[Math.floor(Math.random() * anime.themes.length)]
        return {
          name: anime.name,
          link: theme.mirror.mirrorURL,
          type: `${theme.themeType.includes('OP') ? 'OP' : 'ED'}`,
          songName: theme.themeName,
          songArtists: ['Not Found'],
        }
      }
      default: {
        throw new Error(
          'An unknown theme appears! Unfortunately, I cannot continue, if this seems strange, report it on my support server.'
        )
      }
    }
  }
}
