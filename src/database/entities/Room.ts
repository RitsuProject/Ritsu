import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

class Leaderboard {
  @prop({ required: true })
  id: string;

  @prop({ default: 1 })
  score?: number;
}

class Room {
  @prop()
  public _id!: string;

  @prop({ type: String, required: true })
  public answerers!: string[]

  @prop({ type: Leaderboard, required: true })
  public leaderboard!: Leaderboard[]

  @prop({ default: true })
  public startedBy!: string;

  @prop({ default: true })
  public channel!: string;

  @prop({ default: true })
  public answer!: string;

  @prop({ default: true })
  public currentRound!: number
}

export type RoomDocument = DocumentType<Room>
export default getModelForClass(Room);
