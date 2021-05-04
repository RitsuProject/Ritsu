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

  @prop({ default: 1 })
  score?: number
}

export type RoomLeaderboardDocument = DocumentType<RoomLeaderboard>
export default getModelForClass(RoomLeaderboard)
