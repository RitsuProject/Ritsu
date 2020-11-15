const i18next = require('i18next')
const backend = require('i18next-node-fs-backend')
const fs = require('fs')

module.exports.i18nService = class i18nService {
  constructor() {
    this.types = ['commands', 'utils', 'permissions', 'game']
    this.langs = ['pt-BR', 'en-US', 'es-ES', 'it-IT']
  }

  async loadLocales() {
    i18next.use(backend).init({
      ns: this.types,
      supportedLngs: this.langs,
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
