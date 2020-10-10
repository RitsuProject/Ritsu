const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  answerers: { type: Array, required: true },
  answser: { type: String, required: true },
  currentRound: { type: Number, required: true },
})

const Rooms = mongoose.model('Rooms', RoomSchema)
module.exports.Rooms = Rooms
