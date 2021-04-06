import { Message } from 'eris'
import Rooms from '@entities/Room'

export default class RoomHandler {
  private message: Message
  private isSinglePlayer: boolean
  constructor(message: Message, isSinglePlayer: boolean) {
    this.message = message
    this.isSinglePlayer = isSinglePlayer
  }

  async handleRoom() {
    const oldRoom = await Rooms.findById(this.message.guildID)
    if (!oldRoom) {
      console.log(`[ROOM] Creating a new Room in ${this.message.guildID}`)
      const newRoom = await this.createRoom()
      return newRoom
    } else {
      console.log(`[ROOM] Room Already Exists in ${this.message.guildID}`)
      oldRoom.currentRound++
      oldRoom.answerers = []
      await oldRoom.save()
      return oldRoom
    }
  }

  async createRoom() {
    const room = new Rooms({
      _id: this.message.guildID,
      answerers: [],
      channel: this.message.channel.id,
      startedBy: this.message.author.id,
      isSinglePlayer: this.isSinglePlayer,
      leaderboard: [],
      currentRound: 1,
    })

    // for some reason room.save() returns Promise<Document> instead of Promise<DocumentType<Room>>
    await room.save()
    return room
  }
}
