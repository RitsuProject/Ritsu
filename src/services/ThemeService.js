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

    return { normal: video, link: animeLink }
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
