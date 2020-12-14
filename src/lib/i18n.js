const i18next = require('i18next')
const backend = require('i18next-node-fs-backend')
const fs = require('fs')

module.exports.I18n = class I18n {
  constructor() {
    this.types = ['commands', 'utils', 'permissions', 'game']
    this.langs = ['pt-BR', 'en-US', 'de-DE', 'es-ES', 'it-IT']
  }

  async loadLocales() {
    i18next.use(backend).init({
      ns: this.types,
      supportedLngs: this.langs,
      preload: fs.readdirSync('./src/locales'),
      // preload: fs.readdirSync('./src/sourceLocales'),
      fallbackLng: 'en-US',
      backend: {
        loadPath: './src/locales/{{lng}}/{{ns}}.json',
        // loadPath: './src/sourceLocales/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
      returnEmpyString: false,
    })
  }
}
