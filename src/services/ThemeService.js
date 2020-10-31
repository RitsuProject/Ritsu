const p = require('phin')
const { log } = require('../utils/Logger')

/**
 * Service responsible for extracting themes from Ritsu API.
 * @class
 */

module.exports.ThemeService = class ThemeService {
  constructor() {}

  /**
   * Catch a random theme.
   * @async
   * @param {String} provider - AnimeThemes or Openings.moe (openingsmoe)
   * @return {Promise<Object>} Theme Data
   */

  async getRandomTheme(provider) {
    log('Getting random theme...', 'THEME_SERVICE', false, 'green')
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

  /**
   * Take a random theme from a specific year.
   * @async
   * @param {Number} year - Year
   * @return {[Object|Boolean]} Theme Data
   */

  async getThemeFromYear(year) {
    log(`Getting random theme from ${year}...`, 'THEME_SERVICE', false, 'green')
    const random = await p({
      method: 'GET',
      url: `${process.env.API_URL}/themes/random/year?year=${year}`,
      parse: 'json',
    })

    if (random.statusCode === 200) {
      return {
        name: random.body.name,
        link: random.body.link,
        type: random.body.type,
        warning: random.body.warning,
        full: random.body.full,
      }
    } else {
      throw `The API returned a status code that is not 200! | Code: ${random.statusCode}`
    }
  }
}
