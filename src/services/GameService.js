const { Guilds } = require('../models/Guild')
const { ThemeService } = require('./ThemeService')
const { Rooms } = require('../models/Room')
const { log } = require('../utils/Logger')
const { UserService } = require('./UserService')

const stringSimilarity = require('string-similarity')
const mal = require('mal-scraper')
const phin = require('phin')
const EmbedGen = require('../utils/EmbedGen')
const getProviderStatus = require('../utils/getProviderStatus')
const { Message, VoiceChannel } = require('discord.js')

/**
 * Game Service
 * @class
 * @desc The main service of Ritsu, responsible for handling games, getting the themes and playing them.
 * @param {Message} message - Message
 * @param {Object} [options = {}] - Game Options
 * @exemple
 * const gameService = new GameService(message)
 */

module.exports.GameService = class GameService {
  constructor(message, options = {}) {
    this.message = message
    this.year = options.year || null
    this.rounds = options.rounds || 3

    this.time = options.time || 30000
    this.realTime = options.realTime || '30s'
  }

  /**
   * Initializes the game.
   * @async
   */

  async init() {
    const guild = await Guilds.findById(this.message.guild.id)
    if (!guild) return

    const voicech = this.message.member.voice.channel
    if (!voicech) {
      const rooom = await Rooms.findById(this.message.guild.id)
      if (rooom) {
        await rooom.deleteOne()
        guild.rolling = false
        guild.currentChannel = null
        await guild.save()
        this.message.channel.send(
          'It seems that there are no more people on the voice channel, ending the match.'
        )
        return
      }
      return this.message.channel.send(
        'You need to be on a voice channel to start a match!'
      )
    }

    if (this.time < 20000)
      return this.message.channel.send(
        'Please specify a time greater than 20 seconds.'
      )

    this.startNewRound(guild, voicech)
  }

  /**
   * Start a new Round.
   * @async
   * @param {Document} guild - The server that belongs to the round.
   * @param {VoiceChannel} voicech - The voice channel at which the round will start.
   */

  async startNewRound(guild, voicech) {
    if (this.time > 60000) {
      this.message.channel.send(
        '**WARNING:** Perhaps the openings are not big enough for this specified time, if that happens, it will end and you will need to wait for the round to end.'
      )
    }

    const theme = await this.getTheme(guild.provider)
    if (theme === 'offline') return
    if (!theme)
      return this.message.channel.send(
        "I couldn't find an anime corresponding to that year."
      )
    const { answser, link, type, warning } = theme
    guild.rolling = true
    await guild.save()
    const room = await this.roomHandler(answser)

    this.message.channel.send(
      `Starting the #${
        room.currentRound
      } round! What is the anime for this Ending / Opening theme ${
        this.year === 'random' ? '' : `from ${this.year}`
      }? Send in chat the answer! You have ${this.realTime}.\nSend **${
        guild.prefix
      }stop** in the chat if you want to stop the match.`
    )

    console.log(warning)
    if (this.year != 'random') {
      if (guild.provider === 'openingsmoe') {
        this.message.channel.send(`**WARNING:** ${warning}`)
      }
    }

    /* console.log(answser)
    console.log(link) */

    const animeData = await this.getAnimeDetails(answser)
    const answsers = await this.getAnswsers(animeData)

    const answserFilter = (msg) => this.isAnswser(answsers, msg)
    const commanderFilter = (msg) => this.isCommand(guild.prefix, msg)

    const answserCollector = this.message.channel.createMessageCollector(
      answserFilter,
      { time: this.time }
    )
    const commanderCollector = this.message.channel.createMessageCollector(
      commanderFilter,
      { time: this.time }
    )

    answserCollector.on('collect', async (msg) => {
      if (!room.answerers.includes(msg.author.id)) {
        room.answerers.push(msg.author.id)
        const leader = room.leaderboard.find((u) => {
          return (u.id = msg.author.id)
        })
        if (leader === undefined) {
          room.leaderboard.push({ id: msg.author.id })
        }
        await room.save()
        this.message.channel.send(
          `<@${msg.author.id}> got the correct answser! Who is next?`
        )
        await msg.delete()
      }
    })

    commanderCollector.on('collect', async (msg) => {
      if (msg.author.id !== room.startedBy)
        return msg.channel.send(
          'Only the one who started the game can finish it.'
        )
      answserCollector.stop('forceFinished')
    })

    answserCollector.on('end', async (_, reason) => {
      if (reason === 'forceFinished') {
        log('The match was ended by force.', 'GAME_SERVICE', false, 'green')
        this.message.channel.send('This match was ended by force.')
        await this.clear()
        this.finish(voicech, room)
        return
      }

      await room.answerers.forEach(async (id) => {
        this.bumpScore(id)
      })

      const embed = EmbedGen(answser, type, animeData)

      this.message.channel.send('The answser is...', { embed })
      this.message.channel.send(
        `${
          room.answerers.length > 0
            ? room.answerers.map((id) => `<@${id}>`).join(', ')
            : 'Nobody'
        } got the correct answer!`
      )

      if (room.currentRound >= this.rounds) {
        await this.clear()
        this.finish(voicech, room)
      } else {
        await this.startNewRound(guild, voicech)
      }
    })

    this.playTheme(voicech, link, guild, room)
  }

  /**
   * Finish a game.
   * @param {VoiceChannel} voicech - The voice channel which game will end.
   * @param {Document} room - The room.
   */

  async finish(voicech, room) {
    const userService = new UserService()
    voicech.members.each(async (u) => {
      userService.updatePlayed(u.id)
    })
    await voicech.leave()
    const winner = await this.getWinner(room)
    userService.updateEarnings(winner.id)
    if (winner) {
      this.message.channel.send(`<@${winner.id}> is the winner of this match!`)
    } else {
      this.message.channel.send('Nobody won this match.')
    }
    this.message.channel.send('All rounds are over! I hope you guys had fun.')
  }

  /**
   * Delete and change the round data.
   */

  async clear() {
    const guild = await Guilds.findById(this.message.guild.id)
    const room = await Rooms.findById(this.message.guild.id)
    guild.rolling = false
    guild.currentChannel = null
    guild.save()
    room.deleteOne()
  }

  /**
   * Get the theme.
   * @async
   * @param {String} provider - The provider.
   * @returns {(String|Promise<Object>|Boolean)} If the provider is offline, it will return false or a string containing "offline", if not, it will return an object with the theme data.
   */

  async getTheme(provider) {
    const themeService = new ThemeService()
    let randomTheme

    const loading = await this.message.channel.send(`\`Getting the theme...\``)

    if (this.year != 'random') {
      const status = await getProviderStatus(provider)
      if (status) {
        this.message.channel.send(
          `\`The host openings that are selected as default on your server are offline, canceling the match...\``
        )
        return 'offline'
      }
      randomTheme = await themeService.getThemeFromYear(this.year)
      if (!randomTheme || randomTheme === undefined) return false
    } else {
      const status = await getProviderStatus(provider)
      if (status) {
        this.message.channel.send(
          `\`The host openings that are selected as default on your server are offline, I will be switching to another one, if you don't want to see this error change your provider using provider command. (Current: ${provider})\``
        )
        randomTheme = await themeService.getRandomTheme(
          `${provider === 'animethemes' ? 'openingsmoe' : 'animethemes'}`
        )
      } else {
        randomTheme = await themeService.getRandomTheme(provider)
      }
    }
    const answser = randomTheme.name
    loading.delete()
    return {
      answser: answser,
      link: randomTheme.link,
      type: randomTheme.type,
      warning: `${randomTheme.warning ? randomTheme.warning : 'none'}`,
    }
  }

  /**
   * Room Handler
   * @async
   * @desc - Responsible for creating the rooms or checking if they already exist and returning them.
   * @param {String} answser - The answer (the anime)
   * @returns {Promise<Document>} The room.
   */

  async roomHandler(answser) {
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
    return room
  }

  /**
   * Get the match winner.
   * @param {Document} room - The room.
   * @returns {Promise<Document>}  Winner
   */

  getWinner(room) {
    const highestValue = Math.max.apply(
      Math,
      room.leaderboard.map((score) => {
        return score.score
      })
    )
    if (room.leaderboard.length === 0) return false
    const highestUser = room.leaderboard.find((u) => {
      return (u.score = highestValue)
    })
    return highestUser
  }

  /**
   * Increase the score of everyone who won the round.
   * @async
   * @param {Number} id - The user ID.
   */

  async bumpScore(id) {
    // maybe a rewrite in the future?
    const roomWithLeaderboard = await Rooms.findOne({
      leaderboard: { $elemMatch: { id: id } },
    })
    if (roomWithLeaderboard != null) {
      const score = roomWithLeaderboard.leaderboard.find((u) => {
        return (u.id = id)
      })
      await Rooms.updateOne(
        { 'leaderboard.id': id },
        {
          $set: {
            'leaderboard.$.score': score.score + 1,
          },
        }
      )
    }
  }

  /**
   * Is it the answer of the round?
   * @param {Array} answsers
   * @param {Message} msg
   * @return {Promise<Boolean>} True or false.
   */

  isAnswser(answsers, msg) {
    msg = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
    let score = 0
    answsers.forEach((a) => {
      const similarity = stringSimilarity.compareTwoStrings(a, msg)
      score = similarity > score ? similarity : score
    })
    return score > 0.45
  }

  /**
   * Pick up the other titles from the same anime.
   * @param {Object} data - The details of the anime.
   * @returns {Promise<Array>} - The titles.
   */

  getAnswsers(data) {
    const ans = []
    ans.push(data.title)
    if (data.englishTitle != '') {
      ans.push(data.englishTitle)
    }
    if (data.synonyms[0] != '') {
      data.synonyms.forEach((s) => {
        ans.push(s)
      })
    }
    console.log(ans)
    return ans
  }

  /**
   * Is it a command?
   * @param {String} prefix
   * @param {Message} msg
   * @return {Promise<Boolean>} True or false.
   */

  isCommand(prefix, msg) {
    msg = msg.content.trim()
    if (msg === `${prefix}stop`) {
      return true
    } else {
      return false
    }
  }

  /**
   * Play the theme on the voice channel.
   * @async
   * @param {VoiceChannel} voice - Voice Channel
   * @param {String} link - Webm URL
   * @param {Document} guild - The server to which the round belongs.
   * @param {Document} room - The room to which the round belongs.
   */

  async playTheme(voice, link, guild, room) {
    try {
      const response = await phin({
        method: 'GET',
        url: link,
        stream: true,
        timeout: 7000,
      })

      const connection = await voice.join()
      const dispatch = await connection.play(response.stream)

      dispatch.on('start', () => {
        log('Starting the Track', 'GAME_SERVICE', false, 'green')
        this.timeout = setTimeout(() => {
          dispatch.end()
        }, this.time - 2000)
      })

      dispatch.on('error', (error) => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
      this.message.channel.send(
        `A fatal error occurred while trying to catch the theme, it is likely that changing the server theme provider using the **${guild.prefix}provider** command can resolve.`
      )
      await this.clear()
      await this.finish(voice, room)
    }
  }

  /**
   * Create the room.
   * @async
   * @param {String} answser - The answser.
   */

  async createRoom(answser) {
    const newRoom = new Rooms({
      _id: this.message.guild.id,
      answerers: [],
      answser: answser,
      startedBy: this.message.author.id,
      leaderboard: [],
      currentRound: 0,
    })
    await newRoom.save()

    const room = await Rooms.findById(this.message.guild.id)
    return room
  }

  /**
   * Get the full anime data.
   * @async
   * @param {String} name - Anime Name.
   */

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
