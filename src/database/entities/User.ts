import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

/**
 * User
 * @description Discord User model.
 */
class User {
  @prop()
  public _id!: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true, default: 0 })
  public wonMatches!: number

  @prop({ type: String, default: 'Beginner' })
  public rank!: 'Beginner' | 'Pro'

  @prop({ default: 0 })
  public played!: number

  @prop({ default: '' })
  public bio!: string

  @prop({ default: false })
  public admin!: boolean

  @prop({ default: false })
  public patreonSupporter!: boolean

  @prop({ type: String, default: [] })
  public badges!: string[]

  @prop({ default: 0 })
  public xp!: number

  @prop({ default: 0 })
  public levelxp!: number

  @prop({ default: 1 })
  public level!: number

  @prop({ default: 500 })
  public requiredToUP!: number

  @prop({ default: 0 })
  public cakes: number
}

export type UserDocument = DocumentType<User>
export default getModelForClass(User)
