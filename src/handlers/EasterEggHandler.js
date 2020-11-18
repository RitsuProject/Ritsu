const { VoiceChannel, Message } = require('discord.js')
const phin = require('phin')

module.exports.EasterEggHandler = class EasterEggHandler {
  /**
   * Constructor
   * @param {Message} message
   * @param {VoiceChannel} voicech
   */
  constructor(message, voicech, t) {
    this.message = message
    this.voicech = voicech
    this.t = t
  }

  async isValid() {
    const status = this.message.author.presence.activities.filter(
      (a) => a.name === 'Custom Status'
    )[0].state
    switch (status) {
      case 'dango dango dango': {
        return 'clannad'
      }
      case 'tsundere': {
        return 'evangelion'
      }
      case 'el psy kongroo': {
        return 'steins;gate'
      }
      default: {
        return false
      }
    }
  }
  start(secret) {
    return new Promise(async (resolve) => {
      const connection = await this.voicech.join()
      // Easter Egg URL's
      const clannadED = 'https://animethemes.moe/video/Clannad-ED1.webm'
      const evangelionOP =
        'https://animethemes.moe/video/NeonGenesisEvangelion-OP1.webm'
      const steinsGateOP = 'https://animethemes.moe/video/SteinsGate-OP1.webm'

      switch (secret) {
        case 'clannad': {
          const response = await phin({
            // Let's get the stream!'
            method: 'GET',
            url: clannadED,
            stream: true,
            timeout: 20000,
          })
          const dispatch = connection.play(response.stream)

          this.message.channel.send(
            `🍡 **Dango Dango Dango!** ${this.t('game:easteregg', {
              seconds: '20',
            })}`
          )

          dispatch.on('start', () => {
            setTimeout(() => {
              dispatch.end()
              resolve()
            }, 20000)
          })
          break
        }
        case 'evangelion': {
          const response = await phin({
            // Let's get the stream!'
            method: 'GET',
            url: evangelionOP,
            stream: true,
            timeout: 20000,
          })
          const dispatch = connection.play(response.stream)

          this.message.channel.send(
            `<:shinji:778688760648826880> **Oh! I'm seeing a tsundere...** ${this.t(
              'game:easteregg',
              {
                seconds: '20',
              }
            )}`
          )

          dispatch.on('start', () => {
            setTimeout(() => {
              dispatch.end()
              resolve()
            }, 20000)
          })
          break
        }
        case 'steins;gate': {
          const response = await phin({
            // Let's get the stream!'
            method: 'GET',
            url: steinsGateOP,
            stream: true,
            timeout: 20000,
          })
          const dispatch = connection.play(response.stream)

          this.message.channel.send(
            `<a:kurisupatpat:755754404807704686> **Hououin Kyouma!** ${this.t(
              'game:easteregg',
              {
                seconds: '30',
              }
            )}`
          )

          dispatch.on('start', () => {
            setTimeout(() => {
              dispatch.end()
              resolve()
            }, 30000)
          })
        }
      }
    })
  }
}
