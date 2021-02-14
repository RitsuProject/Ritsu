import { readdirSync } from 'fs'
import i18next from 'i18next'
import backend from 'i18next-node-fs-backend'

export default class I18nManager {
  private types: Array<string> = [
    'commands',
    'errors',
    'game',
    'gameQuestions',
    'utils',
  ]

  private langs: Array<string> = ['pt-BR', 'en-US']

  async loadLocales() {
    i18next.use(backend).init({
      ns: this.types,
      supportedLngs: this.langs,
      preload: readdirSync('./src/locales'),
      fallbackLng: 'en-US',
      backend: {
        loadPath: './src/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
    })
  }
}
