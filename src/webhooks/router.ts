import { Request, Router } from 'express'
import RitsuClient from '../structures/RitsuClient'
import PatreonBody from '../interfaces/PatreonBody'
import handlePatreon from './patreon'
import checkPatreonSignature from './middlewares/checkPatreonSignature'

import 'express-async-errors'

function initRouter(client: RitsuClient) {
  const router = Router()

  router.post(
    '/webhooks/patreon',
    checkPatreonSignature,
    (req: Request<null, null, PatreonBody>, res) =>
      handlePatreon(req, res, client)
  )

  return router
}

export default initRouter
