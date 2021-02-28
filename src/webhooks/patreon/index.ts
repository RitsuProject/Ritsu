import { Request, Response } from 'express'
import User from '../../database/entities/User'
import RitsuClient from '../../structures/RitsuClient'
import Constants from '../../utils/Constants'

export default async function handlePatreon(
  req: Request,
  res: Response,
  client: RitsuClient
) {
  const userDiscordId: string = req.body.included[1].attributes.discord_id
  const chargeStatus: string = req.body.data.attributes.last_charge_status

  // Check if user has a Discord Account linked and the charge status as Paid
  if (userDiscordId && chargeStatus === 'Paid') {
    const user = await User.findById(userDiscordId)
    if (user) {
      user.patreonSupporter = true
      await user.save()
    }

    const discordUser = client.users.get(userDiscordId)

    if (discordUser) {
      const dmChannel = await discordUser.getDMChannel()

      // WIP: I'm still in the middle of planning the advantages for Patrons, so the message may change.
      const embed = {
        title: 'Patreon Notice',
        description:
          `Hi! Thank you so much for becoming my new Patron! This helps me a lot to stay strong and mainly to pay my bills!\n\n` +
          `Some advantages may depend on you **contacting my support server** to receive them, if something is wrong there will be the most correct place for you to inform us!\n\n` +
          `Thank you very much for helping the project! I hope you have a lot of fun~~\n\n` +
          `**sazz,**\n` +
          `*Core Developer*`,
        color: Constants.EMBED_COLOR_BASE,
      }

      dmChannel.createMessage({ embed })
    }

    return res.json({
      code: 200,
      message: 'OK',
    })
  } else {
    return res.status(400).json({
      code: 400,
      message: 'Invalid Charge Status/Discord Account.',
    })
  }
}
