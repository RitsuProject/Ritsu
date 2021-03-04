const mongoose = require('mongoose')

const GuildSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  prefix: { type: String, required: false, default: process.env.BOT_PREFIX },
  rolling: { type: Boolean, required: false, default: false },
  lang: { type: String, required: false, default: 'en-US' },
  premium: { type: Boolean, required: true },
  blacklisted: { type: Boolean, required: true, default: false },
})

const Guilds = mongoose.model('Guilds', GuildSchema)
module.exports.Guilds = Guilds
