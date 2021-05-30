import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

class Room {
  @prop()
  public _id!: string

  @prop({ type: String, default: [] })
  public answerers!: string[]

  @prop({ required: true })
  public startedBy!: string

  @prop({ required: true })
  public channel!: string

  @prop({ required: true })
  public isSinglePlayer!: boolean

  @prop({ default: 0 })
  public currentRound!: number
}

export type RoomDocument = DocumentType<Room>
export default getModelForClass(Room)
