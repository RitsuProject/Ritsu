const { TranslationStatus } = require('@crowdin/crowdin-api-client')
const { MessageEmbed } = require('discord.js')
const { Command } = require('../../structures/Command')

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'lang',
      aliases: ['language'],
      description: 'Change the server language.',
      requiredPermissions: ['MANAGE_GUILD'],
      dev: false,
    })
    this.client = client
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */
  async run({ message }, guild, t) {
    const translationsStatus = new TranslationStatus({
      token: process.env.CROWDIN_TOKEN,
    })
    const projectProgress = await translationsStatus.getProjectProgress(
      '428912'
    ) // Get Ritsu Crowdin Project

    // Language Progress
    const ptBRProgress = projectProgress.data.filter(
      (d) => d.data.languageId === 'pt-BR'
    )[0].data.translationProgress
    const enUSProgress = projectProgress.data.filter(
      (d) => d.data.languageId === 'en'
    )[0].data.translationProgress
    const esESProgress = projectProgress.data.filter(
      (d) => d.data.languageId === 'es-ES'
    )[0].data.translationProgress
    const itITProgress = projectProgress.data.filter(
      (d) => d.data.languageId === 'it'
    )[0].data.translationProgress
    const deDeProgress = projectProgress.data.filter(
      (d) => d.data.languageId === 'de'
    )[0].data.translationProgress

    const embed = new MessageEmbed() // Time to mount the embed!
    embed.setTitle(t('commands:lang.languages'))
    embed.setDescription(t('commands:lang.embedDescription'))
    embed.setColor('#eb4034')
    embed.addFields(
      {
        name: ':flag_br: pt-BR',
        value: t('commands:lang.progress', { progress: ptBRProgress }),
        inline: true,
      },
      {
        name: ':flag_us: en-US',
        value: t('commands:lang.progress', { progress: enUSProgress }),
        inline: true,
      },
      {
        name: ':flag_es: es-ES',
        value: t('commands:lang.progress', { progress: esESProgress }),
        inline: true,
      },
      {
        name: ':flag_it: it-IT',
        value: t('commands:lang.progress', { progress: itITProgress }),
        inline: true,
      },
      {
        name: ':flag_de: de-DE',
        value: t('commands:lang.progress', { progress: deDeProgress }),
        inline: true,
      }
    )

    message.channel.send(embed).then((m) => {
      setTimeout(() => {
        m.react('🇧🇷')
      }, 600)
      setTimeout(() => {
        m.react('🇺🇸')
      }, 600)
      setTimeout(() => {
        m.react('🇪🇸')
      }, 600)
      setTimeout(() => {
        m.react('🇩🇪')
      }, 600)
      setTimeout(() => {
        m.react('🇮🇹')
      }, 600)

      const collector = m.createReactionCollector(
        (r, u) =>
          (r.emoji.name === '🇧🇷', '🇺🇸', '🇪🇸', '🇩🇪', '🇮🇹') &&
          u.id !== this.client.user.id &&
          u.id === message.author.id
      ) // Create a fancy reaction collector to listen the flags reactions!

      collector.on('collect', (r) => {
        switch (r.emoji.name) {
          case '🇧🇷': {
            guild.lang = 'pt-BR'
            guild.save()
            message.channel.send(t('commands:lang.success', { lang: 'pt-BR' }))
            break
          }
          case '🇺🇸': {
            guild.lang = 'en-US'
            guild.save()
            message.channel.send(t('commands:lang.success', { lang: 'en-US' }))
            break
          }
          case '🇪🇸': {
            guild.lang = 'es-ES'
            guild.save()
            message.channel.send(t('commands:lang.success', { lang: 'es-ES' }))
            break
          }
          case '🇩🇪': {
            guild.lang = 'de-DE'
            guild.save()
            message.channel.send(t('commands:lang.success', { lang: 'de-DE' }))
            break
          }
          case '🇮🇹': {
            guild.lang = 'it-IT'
            guild.save()
            message.channel.send(t('commands:lang.success', { lang: 'it-IT' }))
            break
          }
        }
      })
    })
  }
}
