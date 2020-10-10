const { Guilds } = require('../models/Guild')
const { ThemeService } = require('./ThemeService')
const { Rooms } = require('../models/Room')
const { MessageEmbed } = require('discord.js')

const stringSimilarity = require('string-similarity')
const mal = require('mal-scraper')
const { log } = require('../utils/Logger')

module.exports.GameService = class GameService {
  constructor(message, options = {}) {
    this.message = message
    this.year = options.year || null
    this.rounds = options.rounds || 3

    this.collector = options.collector || undefined
  }

  async init() {
    const guild = await Guilds.findById(this.message.guild.id)
    if (!guild) return

    const voicech = this.message.member.voice.channel
    if (!voicech)
      return this.message.channel.send(
        'You need to be on a voice channel to start a match!'
      )

    const themeService = new ThemeService()
    let randomTheme
    if (!this.year === 'random') {
      randomTheme = await themeService.getThemeFromYear(this.year)
      if (!randomTheme)
        return this.message.channel.send(
          "I couldn't find an anime corresponding to that year."
        )
    } else {
      randomTheme = await themeService.getRandomTheme()
    }
    const answser = randomTheme.name

    let room = await Rooms.findById(this.message.guild.id)
    if (!room) {
      room = await this.createRoom(answser)
      room.currentRound++
      await room.save()
    } else {
      room.currentRound++
      room.answerers = []
      await room.save()
    }

    this.message.channel.send(
      `Starting the #${
        room.currentRound
      } round! What is the anime for this Ending / Opening theme ${
        this.year === 'random' ? '' : `from ${this.year}`
      }?`
    )

    console.log(answser)
    console.log(randomTheme.link)

    const answserFilter = (msg) => this.isAnswser(answser, msg)
    const commanderFilter = (msg) => this.isCommand(msg)

    const answserCollector = this.message.channel.createMessageCollector(
      answserFilter,
      { time: 30000 }
    )
    const commanderCollector = this.message.channel.createMessageCollector(
      commanderFilter,
      { time: 30000 }
    )

    const animeData = await this.getAnimeDetails(answser)

    answserCollector.on('collect', async (msg) => {
      if (!room.answerers.includes(msg.author.id)) {
        room.answerers.push(msg.author.id)
        await room.save()
        this.message.channel.send(
          `<@${msg.author.id}> got the correct answser! Who is next?`
        )
        await msg.delete()
      }
    })

    commanderCollector.on('collect', async () => {
      await voicech.leave()
      room.remove()
      answserCollector.stop('forceFinished')
    })

    answserCollector.on('end', async (_, reason) => {
      if (reason === 'forceFinished') {
        log('The match was ended by force.', 'GAME_SERVICE', false, 'green')
        this.message.channel.send('This match was ended by force.')
        return
      }
      const embed = new MessageEmbed()
        .setImage(animeData.picture)
        .setTitle(answser)
        .setColor('#33e83c')
        .setFooter(`Type: ${randomTheme.type}`)

      this.message.channel.send('The answser is...', { embed })
      this.message.channel.send(
        `${
          room.answerers.length > 0
            ? room.answerers.map((id) => `<@${id}>`).join(', ')
            : 'Nobody'
        } got the correct answer!`
      )

      if (room.currentRound >= 3) {
        this.finish(voicech, room)
      } else {
        await this.init()
      }
    })

    this.playTheme(voicech, randomTheme.link)
  }

  async finish(voicech, room) {
    await room.remove()
    await voicech.leave()
    this.message.channel.send('All rounds are over! I hope you guys had fun.')
  }

  async isAnswser(answser, msg) {
    msg = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()

    const similarity = stringSimilarity.compareTwoStrings(answser, msg)

    return similarity > 0.45
  }

  async isCommand(msg) {
    msg = msg.content.trim()
    if (msg === 'ri!stop') {
      return true
    } else {
      return false
    }
  }

  async playTheme(voice, link) {
    const connection = await voice.join()
    const dispatch = await connection.play(link)

    dispatch.on('start', () => {
      log('Starting the Track', 'GAME_SERVICE', false, 'green')
      this.timeout = setTimeout(() => {
        dispatch.end()
      }, 28000)
    })

    dispatch.on('error', (error) => {
      console.log(error)
    })
  }

  async createRoom(answser) {
    const newRoom = new Rooms({
      _id: this.message.guild.id,
      answerers: [],
      answser: answser,
      currentRound: 0,
    })
    await newRoom.save()

    const room = await Rooms.findById(this.message.guild.id)
    return room
  }

  async getAnimeDetails(name) {
    try {
      const malAnime = await mal.getInfoFromName(name)
      return malAnime
    } catch (e) {
      log(e, 'GAME_SERVICE', true)
      this.message.channel.send(
        `An error occurred in trying to get MyAnimeList data from this anime.\n${e.message}`
      )
    }
  }
}
