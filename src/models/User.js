const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  answerers: { type: Array, required: true },
  answser: { type: String, required: true },
  currentRound: { type: Number, required: true },
})

const Users = mongoose.model('Users', UserSchema)
module.exports.Users = Users
