const mongoose = require('mongoose')

const BadgeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  type: { type: String, required: true },
  createdBy: { type: String, required: true },
})

const Badges = mongoose.model('Badges', BadgeSchema)
module.exports.Badges = Badges
