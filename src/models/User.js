const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // User ID
  name: { type: String, required: true }, // Username
  wonMatches: { type: Number, required: true }, // Won Matches
  rank: { type: String, required: true, default: 'Beginner' }, // User Rank
  played: { type: Number, required: true }, // Played Matches
  bio: { type: String, required: false }, // User biography.
  admin: { type: Boolean, required: true }, // Is admin?
  badges: { type: Array, required: true, default: [] }, // User Badges
  xp: { type: Number, required: true, default: 0 }, // User XP
  levelxp: { type: Number, required: true, default: 0 }, // Level XP (Like: 1000 for Level 2)
  level: { type: Number, required: true, default: 1 }, // User Level
  requiredToUP: { type: Number, required: true, default: 500 }, // XP required to up to the next level.
})

const Users = mongoose.model('Users', UserSchema)
module.exports.Users = Users
