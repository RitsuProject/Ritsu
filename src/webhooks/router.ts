import { Request, Response, Router } from 'express'
import RitsuClient from '../structures/RitsuClient'
import Patreon from './patreon'
import 'express-async-errors'
function initRouter(client: RitsuClient) {
  const router = Router()

  router.post('/webhooks/patreon', (req: Request, res: Response) =>
    Patreon(req, res, client)
  )

  return router
}

export default initRouter
