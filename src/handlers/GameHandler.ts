import { AnyGuildChannel, Message } from 'eris'
import { MessageCollector } from 'eris-collector'
import NodeCache from 'node-cache'
import { TFunction } from 'i18next'

import RoomHandler from '@handlers/RoomHandler'
import LevelHandler from '@handlers/LevelHandler'
import HintsHandler from '@handlers/HintsHandler'
import Themes from '@handlers/ThemesHandler'

import User from '@entities/User'
import Guilds, { GuildDocument } from '@entities/Guild'
import Rooms, { RoomDocument } from '@entities/Room'

import GameOptions from '@interfaces/GameOptions'
import RitsuClient from '@structures/RitsuClient'
import UnreachableRepository from '@structures/errors/UnreachableRepository'

import getStreamFromURL from '@utils/GameUtils/GetStream'
import GameCollectorUtils from '@utils/GameUtils/GameCollectorUtils'
import getAnimeData from '@utils/GameUtils/GetAnimeData'
import handleError from '@utils/GameUtils/HandleError'
import GameEmbedFactory from '@factories/GameEmbedFactory'

/**
 * GameHandler
 * @description Main core of the game
 */
export default class GameHandler {
  public themesCache: NodeCache
  constructor(
    public message: Message,
    public client: RitsuClient,
    public gameOptions: GameOptions,
    public t: TFunction
  ) {
    this.message = message
    this.client = client
    this.t = t
    this.gameOptions = gameOptions
    this.themesCache = new NodeCache()
  }

  async initGame() {
    const guild = await Guilds.findById(this.message.guildID)
    if (!guild) return

    await this.startNewRound(guild).catch(
      (err: Error | UnreachableRepository) => {
        handleError(this.message, this.t, err)
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
          this.t('game:errors.noUsersInTheVoiceChannel')
        )
      }
      return this.message.channel.createMessage(
        this.t('game:errors.noVoiceChannel')
      )
    }

    const discordGuild = this.client.guilds.get(this.message.guildID)
    const voiceChannel = discordGuild.channels.get(voiceChannelID)
    const isSingleplayer = this.isSinglePlayer(voiceChannel)

    const roomHandler = new RoomHandler(this.message, isSingleplayer)
    const room = await roomHandler.handleRoom()

    // Create our EmbedFactory instance to make super cute embeds.
    const gameEmbedFactory = new GameEmbedFactory(
      this.gameOptions,
      isSingleplayer,
      this.t
    )

    // If it is the first round, will send the starting the match embed.
    if (room.currentRound === 1) {
      const preparingMatchEmbed = gameEmbedFactory.preparingMatch()

      void this.message.channel.createMessage({ embed: preparingMatchEmbed })
    } else {
      const startingNextRoundEmbed = gameEmbedFactory.startingNextRound()

      void this.message.channel.createMessage({ embed: startingNextRoundEmbed })
    }

    const themes = new Themes(this.message, this.gameOptions, this.themesCache)
    const theme = await themes.getTheme()

    const stream = await getStreamFromURL(theme.link).catch(() => {
      throw new Error(this.t('game:errors.unableToLoadStream'))
    })

    const user = await User.findById(this.message.author.id)
    const animeData = await getAnimeData(theme.name, theme.malId)
    const hintsHandler = new HintsHandler(animeData, this.t)

    guild.rolling = true
    await guild.save()

    const roundStartedEmbed = gameEmbedFactory.roundStarted(room.currentRound)
    void this.message.channel.createMessage({ embed: roundStartedEmbed })

    const answerFilter = (msg: Message) =>
      GameCollectorUtils.isAnswer(animeData, msg)
    const fakeCommandFilter = (msg: Message) =>
      GameCollectorUtils.isFakeCommand(guild.prefix, msg)

    const answerCollector = new MessageCollector(
      this.client,
      this.message.channel,
      answerFilter,
      {
        time: this.gameOptions.time,
      }
    )
    const fakeCommandCollector = new MessageCollector(
      this.client,
      this.message.channel,
      fakeCommandFilter,
      {
        time: this.gameOptions.time,
      }
    )

    answerCollector.on('collect', (msg: Message) => {
      void GameCollectorUtils.handleCollect(room, msg)
    })

    fakeCommandCollector.on('collect', (msg: Message) => {
      void GameCollectorUtils.handleFakeCommand(
        guild.prefix,
        user,
        hintsHandler,
        msg
      )
    })

    answerCollector.on(
      'end',
      () =>
        void (async () => {
          const answerers =
            room.answerers.length > 0
              ? room.answerers.map((id) => `<@${id}>`).join(', ')
              : 'Nobody'

          await this.message.channel.createMessage(
            `Correct Users: ${answerers}`
          )

          const answerEmbed = await gameEmbedFactory.answerEmbed(
            theme,
            animeData
          )

          await this.message.channel.createMessage('The answer is...')
          await this.message.channel.createMessage({ embed: answerEmbed })

          // Handle level/xp for each of the answerers.
          room.answerers.forEach((id) => {
            void this.handleLevel(id)
          })

          // If all rounds is over, finish the game, otherwise, start a new round.
          if (room.currentRound >= this.gameOptions.rounds) {
            await this.clearData(room, guild)
            this.client.leaveVoiceChannel(voiceChannelID)
            void this.message.channel.createMessage('Match ended.')
          } else {
            await this.startNewRound(guild).catch((err) => {
              handleError(this.message, this.t, err)
            })
          }
        })()
    )

    void this.playTheme(voiceChannelID, stream)
  }

  // async handleFinish(room: RoomInterface, force: boolean) {}

  async clearData(room: RoomDocument, guild: GuildDocument) {
    guild.rolling = false
    this.themesCache.del(this.themesCache.keys())
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

  async handleLevel(userId: string) {
    const user = await User.findById(userId)
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
