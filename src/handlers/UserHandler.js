const { Users } = require('../models/User')

/**
 * Service responsible for actions related to users (such as updating won matches.)
 * @class
 */

module.exports.UserService = class UserService {
  constructor() {}

  /**
   * Update the played matches.
   * @async
   * @param {Number} id
   */

  async updatePlayed(id) {
    const user = await Users.findById(id)
    if (user) {
      user.played = user.played + 1
      user.save()
    } else {
      return false
    }
    return true
  }

  /**
   * Update won matches.
   * @async
   * @param {Number} id
   */

  async updateEarnings(id) {
    const user = await Users.findById(id)
    if (user) {
      const newValue = user.wonMatches + 1
      user.wonMatches = newValue
      const newRank = this.ranker(newValue)
      if (newRank) {
        user.rank = newRank
      }
      user.save()
    } else {
      return false
    }
    return true
  }

  /**
   * Responsible for dealing with ranks (how to update them if the user has reached a certain amount of games played)
   * @param {Number} value - Won Matches
   * @return {[Boolean|String]} If the user raises a level, it will return the level he raised, otherwise, it will return false.
   */

  ranker(value) {
    if (value === 10) {
      return 'Pro'
    } else if (value === 20) {
      return 'Guesser'
    } else if (value === 30) {
      return 'Pro Guesser'
    } else if (value === 40) {
      return 'Master'
    } else if (value === 50) {
      return 'Weeb Master'
    }
    return false
  }
}
