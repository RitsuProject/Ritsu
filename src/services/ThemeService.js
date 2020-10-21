const p = require('phin')
const { log } = require('../utils/Logger')
module.exports.ThemeService = class ThemeService {
  constructor() {}

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

  async getThemeFromYear(year) {
    log(`Getting random theme from ${year}...`, 'THEME_SERVICE', false, 'green')
    const random = await p({
      method: 'GET',
      url: `https://ritsuapi.herokuapp.com/themes/random/year?year=${year}`,
      parse: 'json',
    })

    console.log()

    return {
      name: random.body.name,
      link: random.body.link,
      type: random.body.type,
      warning: random.body.warning,
      full: random.body.full,
    }
  }
}
