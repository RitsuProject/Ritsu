import { Request, IncomingMessage } from 'express'

declare module 'express' {
  export interface Request {
    rawBody: Buffer
  }
}
