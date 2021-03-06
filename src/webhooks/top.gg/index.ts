import { Request, Response } from 'express'
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
  const dmChannel = await discordUser.getDMChannel()

  await dmChannel.createMessage('owo uwu owo uwu')

  return res.json({
    code: 200,
  })
}
