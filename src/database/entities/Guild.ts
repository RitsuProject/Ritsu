import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose'

/**
 * Guild
 * @description The Discord Guild Model
 */
class Guild {
  @prop()
  public _id!: string

  @prop({ required: true })
  public name!: string

  @prop({ default: process.env.RITSU_PREFIX })
  public prefix?: string

  @prop({ default: false })
  public rolling?: boolean

  @prop({ default: 'en-US' })
  public lang?: string

  @prop({ required: true })
  public premium!: boolean
}

export type GuildDocument = DocumentType<Guild>
export default getModelForClass(Guild)
