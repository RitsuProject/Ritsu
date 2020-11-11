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

    if (tmRes.body.length > 0) {
      return tmRes.body
    } else {
      return false
    }
  }
  async getAnimesByAnilist(username) {
    const tmRes = await p({
      method: 'GET',
      url: `https://themes.moe/api/anilist/${username}`,
      parse: 'json',
    })
    if (tmRes.body.length > 0) {
      return tmRes.body
    } else {
      return false
    }
  }
}
