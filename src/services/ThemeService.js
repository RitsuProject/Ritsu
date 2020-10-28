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
   * @return {Object} Theme Data
   */

  async getRandomTheme(provider) {
    log('Getting random theme...', 'THEME_SERVICE', false, 'green')
    const random = await p({
      method: 'GET',
      url: `https://ritsuapi.herokuapp.com/themes/random?provider=${provider}`,
      parse: 'json',
    })

    return {
      name: random.body.name,
      link: random.body.link,
      type: random.body.type,
      full: random.body.full,
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
      url: `https://ritsuapi.herokuapp.com/themes/random/year?year=${year}`,
      parse: 'json',
    })

    if (random.body.err) {
      // If the API returned an error, return false.
      return false
    }

    return {
      name: random.body.name,
      link: random.body.link,
      type: random.body.type,
      warning: random.body.warning,
      full: random.body.full,
    }
  }
}
