import { Message } from 'eris'
import GuildsInterface from '../interfaces/GuildsInterface'
import Guilds from '../models/Guild'
import Rooms from '../models/Room'
import GameOptions from '../interfaces/GameOptions'
import RitsuClient from '../structures/RitsuClient'
import Themes from './Themes'
import getStreamFromURL from '../utils/GetStream'

export default class Game {
  public message: Message
  public client: RitsuClient
  public gameOptions: GameOptions
  constructor(message: Message, client: RitsuClient, options: GameOptions) {
    this.message = message
    this.client = client
    this.gameOptions = options
  }

  async init() {
    const guild = await Guilds.findById(this.message.guildID)
    if (!guild) return
    await this.startNewRound(guild)
  }

  async startNewRound(guild: GuildsInterface) {
    const voiceChannel = this.message.member.voiceState.channelID

    if (!voiceChannel) {
      const oldRoom = await Rooms.findById(this.message.guildID)
      if (oldRoom) {
        this.client.leaveVoiceChannel(voiceChannel)
      }
      return this.message.channel.createMessage('No Users in Voice Channel.')
    }

    const theme = await this.getTheme()
    const stream = await getStreamFromURL(theme.link)

    this.playTheme(voiceChannel, stream)
  }

  async getTheme() {
    const loadingMessage = await this.message.channel.createMessage(
      `\`Fetching the Anime Theme...\``
    )

    const choosedTheme = await this.chooseTheme()
    loadingMessage.delete()
    return choosedTheme
  }

  async chooseTheme() {
    const themes = new Themes()
    const theme = await themes.getThemeByMode(this.gameOptions)
    if (!theme) {
      this.chooseTheme
    } else {
      return theme
    }
  }

  async playTheme(voiceChannel: string, stream) {
    this.client
      .joinVoiceChannel(voiceChannel)
      .then((connection) => {
        connection.play(stream)
      })
      .catch((e) => {
        throw new Error(`Failed to connect to the Voice Channel | ${e.message}`)
      })
  }
}
