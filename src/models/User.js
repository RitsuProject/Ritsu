const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  wonMatches: { type: Number, required: true },
  played: { type: Number, required: true },
  bio: { type: String, required: false },
  admin: { type: Boolean, required: true }
})

const Users = mongoose.model('Users', UserSchema)
module.exports.Users = Users
