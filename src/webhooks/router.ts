import { Router } from 'express'
import Patreon from './patreon'

const router = Router()

router.get('/webhooks/patreon', Patreon)

export default router
