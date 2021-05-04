import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

class Room {
  @prop()
  public _id!: string

  @prop({ type: String, required: true })
  public answerers!: string[]

  @prop({ default: true })
  public startedBy!: string

  @prop({ default: true })
  public channel!: string

  @prop({ required: true })
  public isSinglePlayer!: boolean

  @prop({ type: String, required: true })
  public themes!: string[]

  @prop({ default: true })
  public currentRound!: number
}

export type RoomDocument = DocumentType<Room>
export default getModelForClass(Room)
