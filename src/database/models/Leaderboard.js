const mongoose = require('mongoose')

const LeaderBoardSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    guildId: { type: String, required: true },
    score: { type: Number, required: false, default: 1 },
  },
  { timestamps: true }
)

const Leaderboards = mongoose.model('Leaderboards', LeaderBoardSchema)
module.exports.Leaderboards = Leaderboards
