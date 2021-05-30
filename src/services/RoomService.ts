import Room from '@entities/Room'

interface CreateRoomDTO {
  id: string
  channelId: string
  startedById: string
  isSinglePlayer: boolean
}

export default class RoomService {
  async getOrCreate(data: CreateRoomDTO) {
    let room = await Room.findById(data.id)
    if (!room) {
      room = new Room({
        _id: data.id,
        channel: data.channelId,
        startedBy: data.startedById,
        isSinglePlayer: data.isSinglePlayer,
      })

      await room.save()
    }

    return room
  }
}
