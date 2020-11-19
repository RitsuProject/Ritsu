const mongoose = require('mongoose')

const LeaderBoardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  score: { type: Number, required: false, default: 1 },
})

const RoomSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  answerers: { type: Array, required: true },
  leaderboard: [LeaderBoardSchema],
  startedBy: { type: String, required: true },
  channel: { type: String, required: true },
  answser: { type: String, required: true },
  currentRound: { type: Number, required: true },
})

const Rooms = mongoose.model('Rooms', RoomSchema)
module.exports.Rooms = Rooms
