const mongoose = require('mongoose')

const GuildSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  bestUser: { type: String, required: false },
  premium: { type: Boolean, required: true },
})

const Guilds = mongoose.model('Guilds', GuildSchema)
module.exports.Guilds = Guilds
