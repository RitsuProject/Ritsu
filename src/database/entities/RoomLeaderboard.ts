import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

/**
 * Room Leaderboard
 * @description The room leaderboard model
 */
class RoomLeaderboard {
  @prop({ required: true })
  _id: string

  @prop({ required: true })
  username: string

  @prop({ required: true })
  guildId: string

  @prop({ default: 0 })
  score?: number

  @prop({ default: 0.0 })
  timeElapsed: number
}

export type RoomLeaderboardDocument = DocumentType<RoomLeaderboard>
export default getModelForClass(RoomLeaderboard)
