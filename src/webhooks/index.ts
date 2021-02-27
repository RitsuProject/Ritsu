import express, { NextFunction, Request, Response } from 'express'
import RitsuClient from '../structures/RitsuClient'
import handleErrors from './middlewares/handleErrors'
import initRouter from './router'

function startWebhooks(client: RitsuClient) {
  const app = express()
  const port = process.env.WEBHOOKS_PORT || 7575
  const router = initRouter(client)

  app.use(
    express.json({
      verify: (req: Request, _, buf) => {
        req.rawBody = buf
      },
    })
  )

  app.use(router)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    handleErrors(err, req, res, next)
  })

  app.listen(port, () => {
    console.log(`[Webhooks] Running at ${port}`)
  })
}

export default startWebhooks
