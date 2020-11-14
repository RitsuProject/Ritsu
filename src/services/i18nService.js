const i18next = require('i18next')
const backend = require('i18next-node-fs-backend')
const fs = require('fs')

module.exports.i18nService = class i18nService {
  constructor() {
    this.types = ['commands']
  }

  async loadLocales() {
    i18next.use(backend).init({
      ns: 'commands',
      preload: await fs.readdirSync('./src/locales'),
      fallbackLng: 'en-US',
      backend: {
        loadPath: './src/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
      returnEmpyString: false,
    })
  }
}
