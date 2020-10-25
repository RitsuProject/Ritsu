const mongoose = require('mongoose')
const ServersSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  animethemes: { type: String, required: false, default: 'online' },
  openingsmoe: { type: String, required: false, default: 'online' },
})

const Servers = mongoose.model('Servers', ServersSchema)
module.exports.Servers = Servers
