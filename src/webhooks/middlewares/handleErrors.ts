import { NextFunction, Request, Response } from 'express'

export default function handleErrors(
  err,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error.',
  })
  next(err)
}
