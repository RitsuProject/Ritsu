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
  console.log(encrypted === hash)
  if (encrypted !== hash)
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized, fuck you onii-chan.', // maybe i'm crazy
      specified_hash: hash,
    })

  const userDiscordId = req.body.data.attributes.discord_id

  if (userDiscordId === null)
    return res.status(400).json({
      code: 400,
      message: 'No Discord Account.',
    })

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
}
