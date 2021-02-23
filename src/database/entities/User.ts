import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

class User {
  @prop()
  public _id!: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public wonMatches!: number

  @prop({ type: String, required: true, default: 'Beginner' })
  public rank!: 'Beginner' | 'Pro'

  @prop({ required: true })
  public played!: number

  @prop()
  public bio?: string

  @prop({ required: true })
  public admin?: boolean

  @prop({ required: true, default: false })
  public patreonSupporter!: boolean

  @prop({ type: String, required: true, default: [] })
  public badges!: string[]

  @prop({ required: true, default: 0 })
  public xp!: number

  @prop({ required: true, default: 0 })
  public levelxp!: number

  @prop({ required: true, default: 1 })
  public level!: number

  @prop({ required: true, default: 500 })
  public requiredToUP!: number
}

export type UserDocument = DocumentType<User>
export default getModelForClass(User)
