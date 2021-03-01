import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'

export default function checkPatreonSignature(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

  if (encrypted !== hash)
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized, fuck you onii-chan.', // maybe i'm crazy
      specified_hash: hash,
    })

  next()
}
