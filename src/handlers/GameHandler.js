const { Guilds } = require('../models/Guild')
const { ThemeService } = require('./ThemeHandler')
const { Rooms } = require('../models/Room')
const { log } = require('../utils/Logger')
const { UserService } = require('./UserHandler')

const stringSimilarity = require('string-similarity')
const mal = require('mal-scraper')

const EmbedGen = require('../utils/functions/generateEmbed')
const { Message, VoiceChannel } = require('discord.js')
const { HostHandler } = require('./HostHandler')
const { EasterEggHandler } = require('./EasterEggHandler')
const { getStream } = require('../utils/functions/getStream')
const { DiscordLogger } = require('../utils/discordLogger')
const { LevelHandler } = require('./LevelHandler')
const { Users } = require('../models/User')

/**
 * Game Service
 * @class
 * @desc The main service of Ritsu, responsible for handling games, getting the themes and playing them.
 * @exemple
 * const gameService = new GameService(message)
 */

module.exports.GameService = class GameService {
  /**
   * @param {Message} message
   * @param {Client} client
   * @param {Object} options
   */
  constructor(message, client, options = {}) {
    this.message = message
    this.client = client
    this.mode = options.mode || 'normal'
    this.rounds = options.rounds || 3

    this.time = options.time || 30000
    this.realTime = options.realTime || '30s'

    this.listService = options.listService || null
    this.listUsername = options.listUsername || null
    this.year = options.year || null
    this.season = options.season || null

    this.t = options.t || null
  }

  /**
   * Initializes the game.
   * @async
   */

  async init() {
    const guild = await Guilds.findById(this.message.guild.id)
    if (!guild) return

    const discordLogger = new DiscordLogger(this.client)
    await discordLogger.logMatch(
      this.rounds,
      this.realTime,
      this.message.author.id,
      this.mode,
      this.message.guild.id
    )

    this.startNewRound(guild).catch(async (e) => {
      log(`GUILD -> ${guild._id} | ${e}`, 'GAME_SERVICE', true)
      this.message.channel.send(
        `<a:bongo_cat:772152200851226684> | ${this.t('game:errors.fatalError', {
          error: `\`${e}\``,
        })}`
      )
      await discordLogger.logError(
        e,
        this.message.author.id,
        this.message.guild.id
      )
    })
  }

  /**
   * Start a new Round.
   * @async
   * @param {Document} guild - The server that belongs to the round.
   */

  async startNewRound(guild) {
    const voicech = this.message.member.voice.channel

    // owo eastereggs (Blocked)
    /*  const easteregg = new EasterEggHandler(this.message, voicech, this.t)
    const secret = await easteregg.isValid()
    if (secret) {
      await easteregg.start(secret)
    } */

    if (!voicech) {
      const room_ = await Rooms.findById(this.message.guild.id)
      if (room_) {
        // If the match host itself is no longer on the voice channel, cancel it.
        const roomChannel = this.message.guild.channels.cache.get(room_.channel)
        roomChannel.leave()
        await this.clear()

        this.message.channel.send(this.t('game:errors.noUsersInVoiceChannel'))
        return
      } // Don't have a match at the moment? But did the user try to start a game without being on the voice channel? Turn back.
      return this.message.channel.send(this.t('game:errors.noVoiceChannel'))
    }

    const theme = await this.getTheme()
    const { answer, link, type, songName, songArtists } = theme

    const loading = await this.message.channel.send(
      `\`${this.t('game:waitingStream')}\``
    )
    // Let's get the stream!
    const stream = await getStream(link).catch(() => {
      loading.delete()
      throw this.t('game:errors.streamTimeout')
    })
    loading.delete()

    guild.rolling = true
    await guild.save()
    const room = await this.roomHandler(answer, voicech.id) // Create a new Room ^w^

    this.message.channel.send(
      this.t('game:roundStarted', {
        round: room.currentRound,
        time: this.realTime,
        prefix: guild.prefix,
      })
    )
    if (this.mode === 'event') {
      this.message.author.send(
        this.t('game:eventModeAnswer', { answer: answer })
      )
    }

    let animeData
    let answers
    if (type !== 'on fire') {
      animeData = await this.getAnimeDetails(answer)
      answers = await this.getAnswers(animeData)
    } else {
      animeData = {
        picture: 'https://cdn.myanimelist.net/images/anime/9/23479.jpg',
        englishTitle: 'Ritsu is Unavailable',
      }
      answers = ['Ritsu is Unavailable']
      this.message.channel.send(this.t('game:errors.unavailable'))
    }

    const answerFilter = (msg) => this.isAnswer(answers, msg)
    const commanderFilter = (msg) => this.isCommand(guild.prefix, msg)

    const answerCollector = this.message.channel.createMessageCollector(
      answerFilter,
      { time: this.time }
    )
    const commanderCollector = this.message.channel.createMessageCollector(
      commanderFilter,
      { time: this.time }
    )

    console.log(answers)

    answerCollector.on('collect', async (msg) => {
      if (!room.answerers.includes(msg.author.id)) {
        room.answerers.push(msg.author.id)
        const leader = room.leaderboard.find((u) => {
          return (u.id = msg.author.id)
        })
        if (leader === undefined) {
          // If the user is not on the leaderboard, we will add him!
          room.leaderboard.push({ id: msg.author.id })
        }
        this.message.channel.send(
          this.t('game:correctAnswer', { user: `<@${msg.author.id}>` })
        )
        await msg.delete()
        await room.save()
      }
    })

    commanderCollector.on('collect', async (msg) => {
      if (msg.author.id !== room.startedBy)
        return msg.channel.send(this.t('game:onlyHostCanFinish'))
      answerCollector.stop('forceFinished')
    })

    answerCollector.on('end', async (_, reason) => {
      if (reason === 'forceFinished') {
        log(
          `GUILD -> ${guild._id} | The match was ended by force.`,
          'GAME_SERVICE',
          true,
          'green'
        )
        this.message.channel.send(this.t('game:forceFinished'))
        await this.clear()
        this.finish(voicech, room, true)
        return
      }

      const levelHandler = new LevelHandler()

      const embed = await EmbedGen(
        this.t,
        answer,
        type,
        songName,
        songArtists,
        animeData
      ) // Time to generate the final embed of the round.

      await this.message.channel.send(this.t('game:answserIs'), { embed })

      this.message.channel.send(
        `${this.t('game:correctUsers', {
          users: `${
            room.answerers.length > 0
              ? room.answerers.map((id) => `<@${id}>`).join(', ')
              : this.t('game:nobody')
          }`,
        })}`
      )

      await room.answerers.forEach(async (id) => {
        const user = await Users.findById(id)
        this.bumpScore(id)
        const stats = await levelHandler.bump(id, this.mode)
        this.message.channel.send(`<@${id}> won :star: **${stats.xp}** XP`)
        if (stats.level !== user.level) {
          this.message.channel.send(
            `Congratulations <@${id}>! You just level up to **${stats.level}**!`
          )
        }
      })

      if (room.currentRound >= this.rounds) {
        // If there are no rounds left, end the game.
        await this.clear()
        this.finish(voicech, room)
      } else {
        await this.startNewRound(guild, voicech).catch(async (e) => {
          log(`GUILD -> ${this.message.guild.id} | ${e}`, 'GAME_SERVICE', true)
          this.message.channel.send(
            `<a:bongo_cat:772152200851226684> | ${this.t(
              'game:errors.fatalError',
              {
                error: `\`${e}\``,
              }
            )}`
          )
          const discordLogger = new DiscordLogger(this.client)
          await discordLogger.logError(
            e,
            this.message.author.id,
            this.message.guild.id
          )
          await this.clear()
          await this.finish(voicech, room, true)
        })
      }
    })

    this.playTheme(voicech, stream, guild, room)
  }

  /**
   * Finish a game.
   * @param {VoiceChannel} voicech - The voice channel which game will end.
   * @param {Document} room - The room.
   * @param {Boolean} force - Force Finished?
   */

  async finish(voicech, room, force) {
    const userService = new UserService()
    let cakes
    if (!force) {
      const winner = await this.getWinner(room)
      if (this.mode != 'event') {
        voicech.members.each(async (u) => {
          // Let's update the number of games played by everyone who was on the voice channel!
          userService.updatePlayed(u.id)
        })
        userService.updateEarnings(winner.id, cakes) // Update the number of won matches by the winner of the game.
      }
      if (winner) {
        const levelHandler = new LevelHandler()
        const stats = await levelHandler.bump(winner.id, this.mode)
        this.message.channel.send(
          this.t('game:winner', {
            user: `<@${winner.id}>`,
            prizes: `:star: **${stats.xp}** XP`,
          })
        )
      } else {
        this.message.channel.send(this.t('game:nobodyWon'))
      }
      this.message.channel.send(this.t('game:roundEnded'))
    }
    await voicech.leave()
  }

  /**
   * Delete and change the round data.
   */

  async clear() {
    const guild = await Guilds.findById(this.message.guild.id)
    const room = await Rooms.findById(this.message.guild.id)
    guild.rolling = false
    guild.save()
    room.deleteOne()
  }

  /**
   * Get the theme.
   * @async
   * @returns {(Promise<Object[]>|Boolean)} If the provider is offline, it will return false or a string containing "offline", if not, it will return an object with the theme data.
   */

  async getTheme() {
    let randomTheme

    const loading = await this.message.channel.send(
      `\`${this.t('game:searchingTheme')}\``
    )
    randomTheme = await this.choose()
    randomTheme.answer = randomTheme.name
    loading.delete()
    return randomTheme
  }

  async choose() {
    const themeService = new ThemeService()
    const hostHandler = new HostHandler()
    let provider = hostHandler.getProvider()
    const theme = await themeService.getAnimeByMode(
      provider,
      this.mode,
      this.listService,
      this.listUsername,
      this.year,
      this.season
    )
    if (theme === 'unavailable')
      return {
        name: 'Ritsu is Unavailable',
        link: 'https://files.catbox.moe/e9k222.mp3',
        type: 'on fire',
        songName: 'Watson Vibing',
        songArtists: ['Amelia Watson'],
      }
    if (!theme) {
      return await this.choose()
    } else {
      return theme
    }
  }

  /**
   * Room Handler
   * @async
   * @desc - Responsible for creating the rooms or checking if they already exist and returning them.
   * @param {String} answer - The answer (the anime)
   * @param {String} channelID - Voice Channel ID
   * @returns {Promise<Document>} The room.
   */

  async roomHandler(answer, channelID) {
    let room = await Rooms.findById(this.message.guild.id)
    if (!room) {
      // If you don't already have a room, create one.
      room = await this.createRoom(answer, channelID)
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
      // (Small hack) Let's get the highest score!
      Math,
      room.leaderboard.map((score) => {
        return score.score
      })
    )
    if (room.leaderboard.length === 0) return false
    const highestUser = room.leaderboard.find((u) => {
      // Find a user with the highest score.
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
   * @param {Array} answers
   * @param {Message} msg
   * @return {Promise<Boolean>} True or false.
   */

  isAnswer(answers, msg) {
    msg = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
    let score = 0
    // Just return false if Ritsu is unavailable.
    if (answers.includes('Ritsu is Unavailable')) return false
    answers.forEach((a) => {
      // Let's compare all the titles!
      const similarity = stringSimilarity.compareTwoStrings(a, msg)
      score = similarity > score ? similarity : score
    })
    return score > 0.45
  }

  /**
   * Pick up the other titles from the same anime.
   * @param {Object} data - The details of the anime.
   * @returns {Promise<Array<String>>} - The titles.
   */

  getAnswers(data) {
    const ans = []
    ans.push(data.title)
    if (data.englishTitle != '') {
      // If is not empty, add to the array.
      ans.push(data.englishTitle)
    }
    if (data.synonyms[0] != '') {
      // If is not empty, add to the array.
      data.synonyms.forEach((s) => {
        ans.push(s)
      })
    }
    // console.log(ans)
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
   */

  async playTheme(voice, stream, guild, room) {
    const connection = await voice.join()
    const dispatch = connection.play(stream)

    dispatch.on('start', () => {
      log(
        `GUILD -> ${guild._id} | Starting the Track`,
        'GAME_SERVICE',
        false,
        'green'
      )
      this.timeout = setTimeout(() => {
        dispatch.end()
      }, this.time - 2000) // When the time is up, finish the music. (Yes, we subtract 2 seconds to be more precise, as there is a delay for the music to end)
    })

    dispatch.on('error', (error) => {
      console.log(error)
      throw error
    })
  }

  /**
   * Create the room.
   * @async
   * @param {String} answer - The answer.
   * @param {String} channelID - VoiceChannel ID
   * @return {Promise<Document>} Room
   */

  async createRoom(answer, channelID) {
    const newRoom = new Rooms({
      _id: this.message.guild.id,
      answerers: [],
      answer: answer,
      channel: channelID,
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
   * @return {Promise<Object>} Anime Data
   */

  async getAnimeDetails(name) {
    try {
      const malAnime = await mal.getInfoFromName(name)
      return malAnime
    } catch (e) {
      log(e, 'GAME_SERVICE', true)
      throw `An error occurred in trying to get MyAnimeList data from this anime.\n${e.message}`
    }
  }
}
