import { Message } from 'eris'
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
import generateEmbed from '@utils/GameUtils/GenerateEmbed'
import handleError from '@utils/GameUtils/HandleError'

/**
 * GameHandler
 * @description The loli responsible for handling the game, exchanging rounds, ending rounds and etc.
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

  async init() {
    const guild = await Guilds.findById(this.message.guildID)
    if (!guild) return
    await this.startNewRound(guild).catch(
      (err: Error | UnreachableRepository) => {
        handleError(this.message, this.t, err)
      }
    )
  }

  async startNewRound(guild: GuildDocument) {
    const voiceChannel = this.message.member.voiceState.channelID

    if (!voiceChannel) {
      const oldRoomExists = await Rooms.exists({ _id: this.message.guildID })
      if (oldRoomExists) {
        this.client.leaveVoiceChannel(voiceChannel)
      }
      return this.message.channel.createMessage('No Users in Voice Channel.')
    }

    const themes = new Themes(this.message, this.gameOptions, this.themesCache)
    const theme = await themes.getTheme()

    const fetchingStreamMessage = await this.message.channel.createMessage(
      `\`Fetching stream...\``
    )
    const stream = await getStreamFromURL(theme.link).catch(() => {
      void fetchingStreamMessage.delete()
      throw new Error(
        'For some extremely evil reason, I was unable to load the current stream of the theme and so I was unable to continue! Restart the game and try again.'
      )
    })

    void fetchingStreamMessage.delete()

    guild.rolling = true
    await guild.save()

    const roomHandler = new RoomHandler(this.message, theme.name)
    const user = await User.findById(this.message.author.id)
    const room = await roomHandler.handleRoom()
    const animeData = await getAnimeData(theme.name, theme.malId)
    const hintsHandler = new HintsHandler(animeData)

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

          const embed = await generateEmbed(theme, animeData)

          await this.message.channel.createMessage('The answer is...')
          await this.message.channel.createMessage({ embed })

          room.answerers.forEach((id) => {
            void this.handleLevel(id)
          })

          if (room.currentRound >= this.gameOptions.rounds) {
            await this.clearData(room, guild)
            this.client.leaveVoiceChannel(voiceChannel)
            void this.message.channel.createMessage('Match ended.')
          } else {
            await this.startNewRound(guild).catch(
              (err: Error | UnreachableRepository) => {
                handleError(this.message, this.t, err)
              }
            )
          }
        })()
    )

    void this.playTheme(voiceChannel, stream)
  }

  // async handleFinish(room: RoomInterface, force: boolean) {}

  async clearData(room: RoomDocument, guild: GuildDocument) {
    guild.rolling = false
    this.themesCache.del(this.themesCache.keys())
    await guild.save()
    await room.deleteOne()
  }

  async handleLevel(userId: string) {
    const user = await User.findById(userId)
    const levelHandler = new LevelHandler()
    const stats = await levelHandler.handleLevelByMode(
      userId,
      this.gameOptions.mode
    )
    user.xp = user.xp + stats.xp
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
