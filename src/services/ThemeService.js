const p = require('phin')
const { log } = require('../utils/Logger')
module.exports.ThemeService = class ThemeService {
  constructor() {}

  async getRandomTheme() {
    log('Getting random theme...', 'THEME_SERVICE', false, 'green')
    const randomPage = Math.floor(Math.random() * (131 - 1)) + 1
    const animesThemes = await p({
      method: 'GET',
      url: `https://animethemes.dev/api/video?limit=200&page=${randomPage}`,
      parse: 'json',
    })

    const videos = animesThemes.body.videos
    const video = videos[Math.floor(Math.random() * videos.length)]

    const animeLink = video.link.replace('animethemes.dev', 'animethemes.moe')
    const isUndefined = await this.checkUndefined(video)

    if (isUndefined) return this.getRandomTheme()

    return {
      name: video.entries[0].theme.anime.name,
      link: animeLink,
      type: video.entries[0].theme.type,
      full: video,
    }
  }

  async getThemeFromYear(year) {
    log(`Getting random theme from ${year}...`, 'THEME_SERVICE', false, 'green')
    const animesThemes = await p({
      method: 'GET',
      url: `https://animethemes.dev/api/anime?limit=200&year=${year}`,
      parse: 'json',
    })

    const animes = animesThemes.body.anime
    const anime = animes[Math.floor(Math.random() * animes.length)]
    if (anime === undefined) return false

    const animeLink = anime.themes[0].entries[0].videos[0].link.replace(
      'animethemes.dev',
      'animethemes.moe'
    )

    return {
      name: anime.name,
      link: animeLink,
      type: anime.themes[0].type,
      full: anime,
    }
  }

  async checkUndefined(video) {
    let answser = video.entries.length

    if (answser === 0) {
      return true
    } else {
      return false
    }
  }
}
