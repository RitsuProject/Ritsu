const { Users } = require("../models/User")
module.exports.UserService = class UserService {
    constructor() {}

    async updatePlayed(id) {
        const user = await Users.findById(id)
        if(user) {
          user.played = user.played + 1
          user.save()
        } else {
            return false
        }
        return true
    }

    async updateEarnings(id) {
        const user = await Users.findById(id)
        if(user) {
            const newValue = user.wonMatches + 1
            user.wonMatches = newValue
            const newRank = this.ranker(newValue)
            if(newRank) {
                user.rank = newRank
            }
            user.save()
        } else {
            return false
        }
        return true
    }

    ranker(value) {
        if(value === 10) {
            return "Pro"
        } else if(value === 20) {
            return "Guesser"
        } else if(value === 30) {
            return "Pro Guesser"
        } else if(value === 40) {
            return "Master"
        } else if(value === 50) {
            return "Weeb Master"
        }
        return false
    }
}