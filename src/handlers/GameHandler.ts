import { Message } from 'eris'
import GuildsInterface from '../interfaces/GuildsInterface'
import Guilds from '../database/entities/Guild'
import Rooms from '../database/entities/Room'
import GameOptions from '../interfaces/GameOptions'
import RitsuClient from '../structures/RitsuClient'
import Themes from './ThemesHandler'
import getStreamFromURL from '../utils/GetStream'
import GameCollectorUtils from '../utils/GameCollectorUtils'
import getAnimeData from '../utils/GetAnimeData'
import AnilistAnime from '../interfaces/AnilistAnime'
import MioSong from '../interfaces/MioSong'

import { MessageCollector } from 'eris-collector'
import RoomInterface from '../interfaces/RoomInterface'
import generateEmbed from '../utils/GenerateEmbed'
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
      this.message.channel.createMessage(
        Constants.DEFAULT_ERROR_MESSAGE.replace('$e', e)
      )
    })
  }

  async startNewRound(guild: GuildsInterface) {
    const voiceChannel: string = this.message.member.voiceState.channelID

    if (!voiceChannel) {
      const oldRoom = await Rooms.findById(this.message.guildID)
      if (oldRoom) {
        this.client.leaveVoiceChannel(voiceChannel)
      }
      return this.message.channel.createMessage('No Users in Voice Channel.')
    }

    const themes = new Themes(this.message, this.gameOptions, this.themesCache)
    const theme: MioSong = await themes.getTheme()

    const fetchingStreamMessage = await this.message.channel.createMessage(
      `\`Fetching stream...\``
    )
    const stream: string = await getStreamFromURL(theme.link).catch((e) => {
      fetchingStreamMessage.delete()
      throw new Error(
        'For some extremely evil reason, I was unable to load the current stream of the theme and so I was unable to continue! Restart the game and try again.'
      )
    })

    fetchingStreamMessage.delete()

    guild.rolling = true
    await guild.save()

    const roomHandler = new RoomHandler(this.message, theme.name)
    const room = await roomHandler.handleRoom()
    const animeData: AnilistAnime = await getAnimeData(theme.name)

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

    answerCollector.on('collect', async (msg: Message) => {
      GameCollectorUtils.handleCollect(room, msg)
    })

    answerCollector.on('end', async (_, reason: string) => {
      const answerers =
        room.answerers.length > 0
          ? room.answerers.map((id) => `<@${id}>`).join(', ')
          : 'Nobody'

      await this.message.channel.createMessage(`Correct Users: ${answerers}`)

      const embed = generateEmbed(theme, animeData)

      await this.message.channel.createMessage('The answer is...')
      await this.message.channel.createMessage({ embed })

      if (room.currentRound >= this.gameOptions.rounds) {
        await this.clearData(room, guild)
        this.client.leaveVoiceChannel(voiceChannel)
        this.message.channel.createMessage('Match ended.')
      } else {
        await this.startNewRound(guild).catch((e) => {
          this.message.channel.createMessage(
            Constants.DEFAULT_ERROR_MESSAGE.replace('$e', e)
          )
        })
      }
    })

    this.playTheme(voiceChannel, stream)
  }

  async handleFinish(room: RoomInterface, force: boolean) {}

  async clearData(room: RoomInterface, guild: GuildsInterface) {
    guild.rolling = false
    this.themesCache.del(this.themesCache.keys())
    await guild.save()
    await room.deleteOne()
  }

  async playTheme(voiceChannel: string, stream) {
    this.client
      .joinVoiceChannel(voiceChannel)
      .then((connection) => {
        connection.play(stream)

        setTimeout(() => {
          connection.stopPlaying()
        }, this.gameOptions.time - 2000)
      })
      .catch((e) => {
        throw new Error(`Failed to connect to the Voice Channel | ${e.message}`)
      })
  }
}
