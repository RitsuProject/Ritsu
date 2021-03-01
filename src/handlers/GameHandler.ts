import { Message } from 'eris'
import Guilds, { GuildDocument } from '../database/entities/Guild'
import Rooms, { RoomDocument } from '../database/entities/Room'
import GameOptions from '../interfaces/GameOptions'
import RitsuClient from '../structures/RitsuClient'
import Themes from './ThemesHandler'
import getStreamFromURL from '../utils/GameUtils/GetStream'
import GameCollectorUtils from '../utils/GameUtils/GameCollectorUtils'
import getAnimeData from '../utils/GameUtils/GetAnimeData'
import { MessageCollector } from 'eris-collector'
import generateEmbed from '../utils/GameUtils/GenerateEmbed'
import NodeCache from 'node-cache'
import Constants from '../utils/Constants'
import RoomHandler from './RoomHandler'

/**
 * GameHandler
 * @description The loli responsible for handling the game, exchanging rounds, ending rounds and etc.
 */
export default class GameHandler {
  public message: Message
  public client: RitsuClient
  public gameOptions: GameOptions
  public themesCache: NodeCache
  constructor(message: Message, client: RitsuClient, options: GameOptions) {
    this.message = message
    this.client = client
    this.gameOptions = options
    this.themesCache = new NodeCache()
  }

  async init() {
    const guild = await Guilds.findById(this.message.guildID)
    if (!guild) return
    await this.startNewRound(guild).catch((e) => {
      console.log(e)
      void this.message.channel.createMessage(
        Constants.DEFAULT_ERROR_MESSAGE.replace('$e', e)
      )
    })
  }

  async startNewRound(guild: GuildDocument) {
    const voiceChannel = this.message.member.voiceState.channelID

    if (!voiceChannel) {
      const oldRoom = await Rooms.findById(this.message.guildID)
      if (oldRoom) {
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
    const room = await roomHandler.handleRoom()
    const animeData = await getAnimeData(theme.name)

    const answerFilter = (msg: Message) =>
      GameCollectorUtils.isAnswer(animeData, msg)

    const answerCollector = new MessageCollector(
      this.client,
      this.message.channel,
      answerFilter,
      {
        time: this.gameOptions.time,
      }
    )

    answerCollector.on(
      'collect',
      (msg: Message) => void GameCollectorUtils.handleCollect(room, msg)
    )

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

          const embed = generateEmbed(theme, animeData)

          await this.message.channel.createMessage('The answer is...')
          await this.message.channel.createMessage({ embed })

          if (room.currentRound >= this.gameOptions.rounds) {
            await this.clearData(room, guild)
            this.client.leaveVoiceChannel(voiceChannel)
            void this.message.channel.createMessage('Match ended.')
          } else {
            await this.startNewRound(guild).catch((e) => {
              void this.message.channel.createMessage(
                Constants.DEFAULT_ERROR_MESSAGE.replace('$e', e)
              )
            })
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
