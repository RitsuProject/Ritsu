import { Request, Response } from 'express'
import crypto from 'crypto'
import User from '../../database/entities/User'
import RitsuClient from '../../structures/RitsuClient'

export default async function Patreon(
  req: Request,
  res: Response,
  client: RitsuClient
) {
  // Check if the message is from...patreon owo
  const hash = req.header('X-Patreon-Signature')
  if (!hash)
    return res.status(400).json({
      code: 400,
      message: 'Where is the Signature Header?',
    })
  const encrypted = crypto
    .createHmac('md5', process.env.PATREON_SECRET)
    .update(req.rawBody)
    .digest('hex')

  console.log(`ENCRYPTED: ${encrypted} | SPECIFIED HASH: ${hash}`)

  if (encrypted !== hash)
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized, fuck you onii-chan.', // maybe i'm crazy
      specified_hash: hash,
    })

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

      dmChannel.createMessage('Thanks for donating to me! (WIP MESSAGE)')
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
