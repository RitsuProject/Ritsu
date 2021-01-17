import mongoose, { Schema, Document } from 'mongoose'

interface UsersInterface extends Document {
  _id: String
  name: String
  wonMatches: Number
  rank: 'Beginner' | 'Pro'
  played: Number
  bio?: String
  admin: Boolean
  badges: Array<String>
  xp: Number
  levelxp: Number
  level: Number
  requiredToUP: Number
}

const UserSchema: Schema = new Schema({
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

const Users = mongoose.model<UsersInterface>('Users', UserSchema)
export default Users
