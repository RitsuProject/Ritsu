const mongoose = require('mongoose')

const GuildSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  rolling: { type: Boolean, required: false, default: false},
  currentChannel: { type: String, required: false, default: null},
  premium: { type: Boolean, required: true },
})

const Guilds = mongoose.model('Guilds', GuildSchema)
module.exports.Guilds = Guilds
