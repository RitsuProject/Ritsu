import { Document } from 'mongoose'

interface LeaderboardInterface {
  id: string
  score?: number
}

export default interface RoomInterface extends Document {
  _id: string
  answerers: Array<string>
  leaderboard: Array<LeaderboardInterface>
  startedBy: string
  channel: string
  answer: string
  currentRound: number
}
