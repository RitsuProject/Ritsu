const { Document } = require('mongoose')
const { Users } = require('../models/User')
const { randomInt } = require('../utils/functions/randomInt')

/**
 * Level Handler
 */
module.exports.LevelHandler = class LevelHandler {
  constructor() {}

  /**
   * Bump XP and Level.
   * @param {String} id - User ID
   * @param {String} mode - Game Mode
   */
  async bump(id, mode) {
    const user = await Users.findById(id)
    if (!user) return
    // TODO: Refactor this.
    switch (mode) {
      case 'normal': {
        const xp = randomInt(10, 50)
        const newXP = user.xp + xp
        user.xp = newXP
        const bumpLevel = await this.leveling(user, newXP)
        if (bumpLevel) {
          user.level = bumpLevel.level
          user.xp = 0
          user.requiredToUP = bumpLevel.newRequired
          user.levelxp = bumpLevel.xp
        }

        user.save()
        return { level: user.level, xp: user.xp }
      }
      case 'hard': {
        const xp = randomInt(10, 85)
        const newXP = user.xp + xp
        user.xp = newXP
        const bumpLevel = await this.leveling(user, newXP)
        if (bumpLevel) {
          user.level = bumpLevel.level
          user.xp = 0
          user.requiredToUP = bumpLevel.newRequired
          user.levelxp = bumpLevel.xp
        }

        user.save()
        return { level: user.level, xp: user.xp }
      }
      default: {
        const xp = randomInt(10, 30)
        const newXP = user.xp + xp
        user.xp = newXP
        const bumpLevel = await this.leveling(user, newXP)
        if (bumpLevel) {
          user.level = bumpLevel.level
          user.xp = 0
          user.requiredToUP = bumpLevel.newRequired
          user.levelxp = bumpLevel.xp
        }

        user.save()
        return { level: user.level, xp: user.xp }
      }
    }
  }

  /**
   * Detect if user can level up or not.
   * @param {Document} user
   * @param {Number} xp
   */
  async leveling(user, xp) {
    if (xp >= user.requiredToUP) {
      const newLevel = user.level + user.level
      const newLevelXP = user.levelxp + 500
      const newRequiredToUP = user.requiredToUP + 500
      return { level: newLevel, xp: newLevelXP, newRequired: newRequiredToUP }
    } else {
      return false
    }
  }
}
