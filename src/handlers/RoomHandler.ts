import { Message } from 'eris'
import Rooms from '@entities/Room'

export default class RoomHandler {
  private message: Message
  private answer: string
  constructor(message: Message, answer: string) {
    this.message = message
    this.answer = answer
  }

  async handleRoom() {
    const oldRoom = await Rooms.findById(this.message.guildID)
    if (!oldRoom) {
      console.log(`[${this.message.guildID}] Creating a new Room...`)
      const newRoom = await this.createRoom()
      return newRoom
    } else {
      console.log(`[${this.message.guildID}] Room Already Exists.`)
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
      answer: this.answer,
      channel: this.message.channel.id,
      startedBy: this.message.author.id,
      leaderboard: [],
      currentRound: 1,
    })

    // for some reason room.save() returns Promise<Document> instead of Promise<DocumentType<Room>>
    await room.save()
    return room
  }
}
