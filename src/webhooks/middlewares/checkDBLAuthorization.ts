import { NextFunction, Request, Response } from 'express'

export default function checkDBLAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.header('Authorization')
  if (!authorization)
    return res.status(400).json({
      code: 400,
      message: 'Where is the Authorization Header?',
    })

  if (authorization !== process.env.DBL_AUTH)
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized, fuck you onii-chan.',
      specified_header: authorization,
    })

  next()
}
