import { Request, Router } from 'express'
import RitsuClient from '../structures/RitsuClient'
import PatreonBody from '../interfaces/PatreonBody'
import handlePatreon from './patreon'
import checkPatreonSignature from './middlewares/checkPatreonSignature'

import 'express-async-errors'
import DBLBody from '../interfaces/DBLBody'
import handleDBL from './top.gg'
import checkDBLAuthorization from './middlewares/checkDBLAuthorization'

function initRouter(client: RitsuClient) {
  const router = Router()

  router.post(
    '/webhooks/patreon',
    checkPatreonSignature,
    (req: Request<null, null, PatreonBody>, res) =>
      handlePatreon(req, res, client)
  )

  router.post(
    '/webhooks/dbl',
    checkDBLAuthorization,
    (req: Request<null, null, DBLBody>, res) => handleDBL(req, res, client)
  )

  return router
}

export default initRouter
