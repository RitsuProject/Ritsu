const p = require('phin')

// TODO: Send this to the backend (Mio)
module.exports.ThemesMoeService = class ThemesMoeService {
  constructor() {}

  async getAnimesByMal(username) {
    const tmRes = await p({
      method: 'GET',
      url: `https://themes.moe/api/mal/${username}`,
      parse: 'json',
    })

    if (tmRes.statusCode === 200) {
      return tmRes.body
    } else {
      return false
    }
  }
  async getAnimesByAnilist(username) {
    console.log('cu')
    const tmRes = await p({
      method: 'GET',
      url: `https://themes.moe/api/anilist/${username}`,
      parse: 'json',
    })
    console.log(tmRes.statusCode)
    if (tmRes.body.length > 0) {
      return tmRes.body
    } else {
      return false
    }
  }
}
