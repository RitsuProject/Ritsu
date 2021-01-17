import { Document } from 'mongoose'

export default interface GuildsInterface extends Document {
  _id: String
  name: String
  prefix: string
  rolling: Boolean
  lang: String
  premium: Boolean
}
