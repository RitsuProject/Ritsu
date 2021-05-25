import { UserDocument } from '@entities/User'
import RitsuUtils from '@utils/RitsuUtils'
import UserService from '@services/UserService'

export default class LevelHandler {
  public userService: UserService = new UserService()

  async handleLevelByMode(userId: string, mode: string) {
    const user = await this.userService.getUser(userId)

    // TODO: Make a real algorithm to calculate level/xp instead of this shit.

    switch (mode) {
      case 'normal': {
        const xp = RitsuUtils.randomIntBetween(10, 50)
        await this.handleLeveling(user, xp)

        return { level: user.level, xp: xp }
      }
      case 'hard': {
        const xp = RitsuUtils.randomIntBetween(10, 85)
        await this.handleLeveling(user, xp)

        return { level: user.level, xp: xp }
      }
      default: {
        const xp = RitsuUtils.randomIntBetween(10, 30)
        await this.handleLeveling(user, xp)

        return { level: user.level, xp: xp }
      }
    }
  }

  async handleLeveling(user: UserDocument, modeXP: number) {
    const newXP = user.xp + modeXP

    if (newXP >= user.requiredToUP) {
      const level = user.level
      const newLevel = level + 1

      /* Little Explanation:
        If the user level is above or equal to 20, new XP for all the levels will be 10000.
        When a user passes a level and he is not yet level 20, it will be added as a requirement for him to pass +500 more XP
        so if a user is at level 2, for him to pass the level he will need 1500, level 3 2000 and so on.
      */

      const newLevelXP = user.level >= 20 ? 10000 : user.levelxp + 500
      const newRequiredToUP = user.level >= 20 ? 10000 : user.requiredToUP + 500

      user.level = newLevel
      user.xp = 0
      user.requiredToUP = newRequiredToUP
      user.levelxp = newLevelXP

      await user.save()
    }
  }
}
