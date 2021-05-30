import { TFunction } from 'i18next'
import InvalidMatchConfig from '@structures/errors/InvalidMatchConfig'

export default class EmbedFactory {
  constructor(private locales: TFunction) {
    this.locales = locales
  }

  invalidMatchConfigEmbed(prefix: string, error: InvalidMatchConfig) {
    const embed = {
      title: this.locales('errors:invalidMatchConfig.title'),
      description: `${error.message}`,
      fields: [
        {
          name: this.locales('errors.invalidMatchConfig.example'),
          value: `\`${error.example}\``,
        },
      ],
      footer: {
        text: this.locales('errors.invalidMatchConfig.footer', {
          prefix,
        }),
      },
      color: 0xf52516,
    }

    return embed
  }
}
