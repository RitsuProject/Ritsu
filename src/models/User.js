const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  wonMatches: { type: Number, required: true },
  rank: { type: String, required: true, default: 'Beginner' },
  played: { type: Number, required: true },
  bio: { type: String, required: false },
  admin: { type: Boolean, required: true },
  badges: { type: Array, required: true, default: [] },
  cakes: { type: Number, required: true, default: 0 },
})

const Users = mongoose.model('Users', UserSchema)
module.exports.Users = Users
