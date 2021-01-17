import { Document } from 'mongoose'

export default interface RoomInterface extends Document {
  _id: String
  answerers: Array<String>
  leaderboard: {
    id: String
    score: Number
  }
  startedBy: String
  channel: String
  answer: String
  currentRound: Number
}
