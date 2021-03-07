import { Request, Response } from 'express'
import User from '../../database/entities/User'
import DBLBody from '../../interfaces/DBLBody'
import RitsuClient from '../../structures/RitsuClient'

export default async function handleDBL(
  req: Request<null, null, DBLBody>,
  res: Response,
  client: RitsuClient
) {
  if (!req.body.user)
    return res.status(400).json({
      code: 400,
      message: 'Missing User',
    })

  const discordUser = client.users.get(req.body.user)
  const user = await User.findById(req.body.user)
  const dmChannel = await discordUser.getDMChannel()

  // If the user is a patreon supporter, will be added +2 cakes to him, if not, just one.
  if (user.patreonSupporter) {
    user.cakes = user.cakes + 2
  } else {
    user.cakes = user.cakes + 1
  }
  await user.save()

  await dmChannel.createMessage('owo uwu owo uwu')

  return res.json({
    code: 200,
  })
}
