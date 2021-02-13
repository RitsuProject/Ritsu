import { Document } from 'mongoose'

export default interface GuildsInterface extends Document {
  _id: string
  name: string
  prefix: string
  rolling: boolean
  lang: string
  premium: boolean
}
