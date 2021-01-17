import mongoose, { Schema } from 'mongoose'
import RoomInterface from '../interfaces/RoomInterface'

const LeaderBoardSchema: Schema = new Schema({
  id: { type: String, required: true },
  score: { type: Number, required: false, default: 1 },
})

const RoomSchema: Schema = new Schema({
  _id: { type: String, required: true },
  answerers: { type: Array, required: true },
  leaderboard: [LeaderBoardSchema],
  startedBy: { type: String, required: true },
  channel: { type: String, required: true },
  answer: { type: String, required: true },
  currentRound: { type: Number, required: true },
})

const Rooms = mongoose.model<RoomInterface>('rooms', RoomSchema)
export default Rooms
