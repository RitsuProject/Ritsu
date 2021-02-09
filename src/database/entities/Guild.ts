import mongoose, { Schema } from 'mongoose'
import GuildsInterface from '../../interfaces/GuildsInterface'

const GuildsSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  prefix: { type: String, required: false, default: process.env.RITSU_PREFIX },
  rolling: { type: Boolean, required: false, default: false },
  lang: { type: String, required: false, default: 'en-US' },
  premium: { type: Boolean, required: true },
})

const Guilds = mongoose.model<GuildsInterface>('guilds', GuildsSchema)
export default Guilds
