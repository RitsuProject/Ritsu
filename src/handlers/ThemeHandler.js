const p = require('phin')
const { ThemesMoeService } = require('../services/ThemesMoeService')
const { log } = require('../utils/Logger')

/**
 * Service responsible for extracting themes from Ritsu API.
 * @class
 */

module.exports.ThemeService = class ThemeService {
  constructor() {}

  async getAnimeByMode(provider, mode, listService, listUsername) {
    switch (mode) {
      case 'easy': {
        const randomPage = Math.floor(Math.random() * (60 - 1)) + 1
        const rank = await p({
          method: 'GET',
          url: `https://api.jikan.moe/v3/top/anime/${randomPage}/bypopularity`,
          parse: 'json',
        })

        const animes = rank.body.top
        const anime = animes[Math.floor(Math.random() * animes.length)]

        const search = await p({
          method: 'GET',
          url: `${process.env.API_URL}/themes/search?provider=${provider}&value=${anime.title}`,
          parse: 'json',
        })
        if (search.statusCode === 200) {
          return {
            name: search.body.name,
            link: search.body.link,
            type: search.body.type,
            full: search.body.full,
          }
        } else if (search.body.err === 'no_anime') {
          return false
        }
        break
      }
      case 'normal': {
        const random = await p({
          method: 'GET',
          url: `${process.env.API_URL}/themes/random?provider=${provider}`,
          parse: 'json',
        })

        if (random.statusCode === 200) {
          return {
            name: random.body.name,
            link: random.body.link,
            type: random.body.type,
            full: random.body.full,
          }
        } else {
          throw `The API returned a status code that is not 200! | Code: ${random.statusCode}`
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
          url: `${process.env.API_URL}/themes/random/year?year=${year}`,
          parse: 'json',
        })
        if (search.statusCode === 200) {
          return {
            name: search.body.name,
            link: search.body.link,
            type: search.body.type,
            full: search.body.full,
          }
        } else if (search.body.err === 'no_anime') {
          return false
        }
        break
      }
      case 'list': {
        const themesMoe = new ThemesMoeService()
        let userAnimes
        if (listService === 'mal') {
          userAnimes = await themesMoe.getAnimesByMal(listUsername)
        } else if (listService === 'anilist') {
          userAnimes = await themesMoe.getAnimesByAnilist(listUsername)
        }
        const anime = userAnimes[Math.floor(Math.random() * userAnimes.length)]
        const theme =
          anime.themes[Math.floor(Math.random() * anime.themes.length)]

        return {
          name: anime.name,
          link: theme.mirror.mirrorURL,
          type: `${theme.themeType.includes('OP') ? 'OP' : 'ED'}`,
          full: anime,
        }
      }
    }
  }
}
