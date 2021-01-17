import { Message } from 'eris'
import GuildsInterface from '../interfaces/GuildsInterface'
import Guilds from '../models/Guild'
import Rooms from '../models/Room'
import GameOptions from '../interfaces/GameOptions'
import RitsuClient from '../structures/RitsuClient'

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
  }
}
