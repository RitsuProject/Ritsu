import { Router } from 'express'
import RitsuClient from '../structures/RitsuClient'
import handlePatreon from './patreon'
import checkPatreonSignature from './middlewares/checkPatreonSignature'

import 'express-async-errors'

function initRouter(client: RitsuClient) {
  const router = Router()

  router.post('/webhooks/patreon', checkPatreonSignature, (req, res) =>
    handlePatreon(req, res, client)
  )

  return router
}

export default initRouter
