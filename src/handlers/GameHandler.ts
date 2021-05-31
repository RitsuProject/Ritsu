import { AnyGuildChannel, Message } from 'eris'
import { MessageCollector } from 'eris-collector'
import { TFunction } from 'i18next'
import NodeCache from 'node-cache'

import LevelHandler from '@handlers/LevelHandler'
import HintsHandler from '@handlers/HintsHandler'
import Themes from '@handlers/ThemesHandler'
import GameCommandHandler from '@handlers/GameCommandHandler'

import { GuildDocument } from '@entities/Guild'
import Rooms, { RoomDocument } from '@entities/Room'
import RoomLeaderboard from '@entities/RoomLeaderboard'

import GameOptions from '@interfaces/GameOptions'
import TimeElapsed from '@interfaces/TimeElapsed'
import RitsuClient from '@structures/RitsuClient'
import UnreachableRepository from '@structures/errors/UnreachableRepository'

import getStreamFromURL from '@utils/GameUtils/GetStream'
import GameCollectorUtils from '@utils/GameUtils/GameCollectorUtils'
import getAnimeData from '@utils/GameUtils/GetAnimeData'
import handleError from '@utils/GameUtils/HandleError'
import Timer from '@utils/Timer'
import GameEmbedFactory from '@factories/GameEmbedFactory'

import UserService from '@services/UserService'
import GuildService from '@services/GuildService'
import RoomService from '@services/RoomService'

/**
 * GameHandler
 * @description Main core of the game
 */
export default class GameHandler {
  public themesCache: NodeCache

  public roomService: RoomService = new RoomService()
  public userService: UserService = new UserService()
  public guildService: GuildService = new GuildService()

  constructor(
    public message: Message,
    public client: RitsuClient,
    public gameOptions: GameOptions,
    public locales: TFunction
  ) {
    this.message = message
    this.client = client
    this.locales = locales
    this.gameOptions = gameOptions
    this.themesCache = new NodeCache()
  }

  async initGame() {
    const guild = await this.guildService.getGuild(this.message.guildID)

    await this.startNewRound(guild).catch(
      (err: Error | UnreachableRepository) => {
        handleError(this.message, this.locales, err)
      }
    )
  }

  async startNewRound(guild: GuildDocument) {
    const voiceChannelID = this.message.member.voiceState.channelID

    if (!voiceChannelID) {
      const oldRoomExists = await Rooms.exists({ _id: this.message.guildID })
      if (oldRoomExists) {
        this.client.leaveVoiceChannel(voiceChannelID)
        return this.message.channel.createMessage(
          this.locales('game:errors.noUsersInTheVoiceChannel')
        )
      }
      return this.message.channel.createMessage(
        this.locales('game:errors.noVoiceChannel')
      )
    }

    const discordGuild = this.client.guilds.get(this.message.guildID)
    const voiceChannel = discordGuild.channels.get(voiceChannelID)
    const isSingleplayer = this.isSinglePlayer(voiceChannel)

    const room = await this.roomService.getOrCreate({
      id: this.message.guildID,
      channelId: this.message.channel.id,
      startedById: this.message.author.id,
      isSinglePlayer: isSingleplayer,
    })

    room.currentRound++
    room.answerers = []
    await room.save()

    // Create our EmbedFactory instance to make super cute embeds.
    const gameEmbedFactory = new GameEmbedFactory(
      this.gameOptions,
      isSingleplayer,
      this.locales
    )
    let startingNextRoundMsg: Message

    // If it is the first round, will send the starting the match embed.
    if (room.currentRound === 1) {
      const preparingMatchEmbed = gameEmbedFactory.preparingMatch()

      void this.message.channel.createMessage({ embed: preparingMatchEmbed })
    } else {
      const startingNextRoundEmbed = gameEmbedFactory.startingNextRound()

      startingNextRoundMsg = await this.message.channel.createMessage({
        embed: startingNextRoundEmbed,
      })
    }

    const themes = new Themes(this.message, this.gameOptions, this.themesCache)
    const theme = await themes.getTheme()

    const stream = await getStreamFromURL(theme.link).catch(() => {
      throw new Error(this.locales('game:errors.unableToLoadStream'))
    })

    const user = await this.userService.getUser(this.message.author.id)
    const animeData = await getAnimeData(theme.name, theme.malId)
    const hintsHandler = new HintsHandler(animeData, this.locales)

    guild.rolling = true
    await guild.save()

    const startTime = new Date()
    const timer = new Timer(startTime)
    const timeElapsed: TimeElapsed[] = []
    timeElapsed.splice(0, timeElapsed.length) // Clear the array to remove old entries.

    const roundStartedEmbed = gameEmbedFactory.roundStarted(room.currentRound)
    if (startingNextRoundMsg) {
      await startingNextRoundMsg.delete()
    }

    void this.message.channel.createMessage({ embed: roundStartedEmbed })

    const answerFilter = (msg: Message) =>
      GameCollectorUtils.isAnswer(animeData, msg)

    const gameCommandFilter = (msg: Message) =>
      GameCollectorUtils.isFakeCommand(guild.prefix, msg)

    const gameCommandCollector = new MessageCollector(
      this.client,
      this.message.channel,
      gameCommandFilter,
      {
        time: this.gameOptions.time,
      }
    )

    const answerCollector = new MessageCollector(
      this.client,
      this.message.channel,
      answerFilter,
      {
        time: this.gameOptions.time,
      }
    )

    gameCommandCollector.on('collect', (msg: Message) => {
      const gameCommandHandler = new GameCommandHandler(
        this.client,
        this.message,
        this.locales,
        guild.prefix
      )
      const command = msg.content.trim()

      switch (command) {
        case `${guild.prefix}stop`: {
          void gameCommandHandler.handleStopCommand(room, answerCollector)
          break
        }
        case `${guild.prefix}hint`: {
          void gameCommandHandler.handleHintCommand(user, hintsHandler)
          break
        }
      }
    })

    answerCollector.on('collect', (msg: Message) => {
      timeElapsed.push({
        id: msg.author.id,
        time: timer.endTimer(),
        answer: msg.content,
      })
      void GameCollectorUtils.handleCollect(
        this.locales,
        timeElapsed,
        room,
        msg
      )
    })

    answerCollector.on(
      'end',
      (_, stopReason) =>
        void (async () => {
          if (stopReason === 'forceFinished') {
            await this.handleFinish(room, voiceChannelID, isSingleplayer, true)
            await this.clearData(room, guild)
            return
          }

          const answerEmbed = await gameEmbedFactory.answerEmbed(
            theme,
            animeData
          )

          await this.message.channel.createMessage(
            this.locales('game:answerIs')
          )
          await this.message.channel.createMessage({ embed: answerEmbed })

          // Handle level/xp for each of the answerers.
          room.answerers.forEach((id) => {
            void this.bumpScoreAndTime(timeElapsed, id)
            void this.handleLevel(id)
          })

          // If all rounds is over, finish the game, otherwise, start a new round.
          if (room.currentRound >= this.gameOptions.rounds) {
            await this.handleFinish(room, voiceChannelID, isSingleplayer, false)
            await this.clearData(room, guild)

            void this.message.channel.createMessage(
              this.locales('game:roundEnded')
            )
          } else {
            const roundEndedLeaderboard = await gameEmbedFactory.roundEndedLeaderboard(
              this.message.guildID,
              timeElapsed
            )

            await this.message.channel.createMessage({
              embed: roundEndedLeaderboard,
            })

            void this.startNewRound(guild).catch((err) => {
              handleError(this.message, this.locales, err)
            })
          }
        })()
    )

    void this.playTheme(voiceChannelID, stream)
  }

  async handleFinish(
    room: RoomDocument,
    voiceChannelID: string,
    isSinglePlayer: boolean,
    force: boolean
  ) {
    if (!force) {
      const matchWinner = await this.getMatchWinner(isSinglePlayer)

      const gameEmbedFactory = new GameEmbedFactory(
        this.gameOptions,
        isSinglePlayer,
        this.locales
      )

      if (matchWinner) {
        const winnerUser = await this.userService.getUser(matchWinner._id)
        const levelHandler = new LevelHandler()

        const newStats = await levelHandler.handleLevelByMode(
          winnerUser._id,
          this.gameOptions.mode
        )

        const matchEndedLeaderboard = await gameEmbedFactory.matchEndedLeaderboard(
          this.message.guildID,
          winnerUser,
          newStats
        )

        await this.message.channel.createMessage({
          embed: matchEndedLeaderboard,
        })
      } else {
        const noWinnerEmbed = gameEmbedFactory.noWinnerEmbed()

        await this.message.channel.createMessage({
          embed: noWinnerEmbed,
        })
      }
    }
    this.client.leaveVoiceChannel(voiceChannelID)
  }

  async getMatchWinner(isSinglePlayer: boolean) {
    const leaderboards = await RoomLeaderboard.find({
      guildId: this.message.guildID,
    })
    // Return a false boolean if there no leaderboard (indicating that nobody won)
    if (!leaderboards) return false

    const scores = leaderboards.map((user) => {
      return user.score
    })

    const highestScore = Math.max(...scores)

    if (isSinglePlayer) {
      // Calculate half of the rounds.
      const halfRounds = this.gameOptions.rounds / 2
      // Round the half of the rounds number to the nearest integer
      const roundedHalfRounds = Math.round(halfRounds)

      const wonRounds = highestScore

      // If the user won rounds is not equal to the half of the rounds, return a false boolean (indicating that nobody won)
      if (roundedHalfRounds > wonRounds) return false
    }

    // Get the user with the highest score.
    const highestUser = await RoomLeaderboard.findOne({
      guildId: this.message.guildID,
      score: highestScore,
    })

    return highestUser
  }

  async clearData(room: RoomDocument, guild: GuildDocument) {
    const leaderboards = await RoomLeaderboard.find({
      guildId: this.message.guildID,
    })

    this.themesCache.del(this.themesCache.keys())
    guild.rolling = false
    leaderboards.map(async (board) => {
      await board.deleteOne()
    })

    await guild.save()
    await room.deleteOne()
  }

  isSinglePlayer(voiceChannel: AnyGuildChannel) {
    // If the specified channel is not type 2 (VoiceChannel), throw a error.
    if (voiceChannel.type !== 2) throw new Error('Invalid Channel Type')
    const voiceChannelMembers = voiceChannel.voiceMembers.filter((member) => {
      return member.id !== this.client.user.id // Ignore the bot
    })
    if (voiceChannelMembers.length === 1) return true
    return false
  }

  async bumpScoreAndTime(timeElapsed: TimeElapsed[], userId: string) {
    const leaderboard = await RoomLeaderboard.findById(userId)

    const userTimeElapsed = timeElapsed.find((user) => user.id === userId)

    if (leaderboard) {
      leaderboard.score = leaderboard.score + 1
      leaderboard.timeElapsed = userTimeElapsed.time
      await leaderboard.save()
    }
  }

  async handleLevel(userId: string) {
    const user = await this.userService.getUser(userId)
    const levelHandler = new LevelHandler()
    const stats = await levelHandler.handleLevelByMode(
      userId,
      this.gameOptions.mode
    )
    user.xp = user.xp + stats.xp

    // If the new level is not equal to the user level, this means that the user level up!
    if (stats.level !== user.level) {
      void this.message.channel.createMessage(
        `Congratulations <@${userId}>! You just level up to **${stats.level}**!`
      )
    }
    await user.save()
  }

  playTheme(voiceChannel: string, stream: string) {
    this.client
      .joinVoiceChannel(voiceChannel)
      .then((connection) => {
        connection.play(stream)

        setTimeout(() => {
          connection.stopPlaying()
        }, this.gameOptions.time - 2000)
      })
      .catch((e: Error) => {
        throw new Error(`Failed to connect to the Voice Channel | ${e.message}`)
      })
  }
}
