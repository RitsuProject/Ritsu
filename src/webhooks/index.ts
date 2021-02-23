import express from 'express'
import router from './router'

const app = express()
const port = process.env.WEBHOOKS_PORT || 7575

app.use(router)

function startWebhooks() {
  app.listen(port, () => {
    console.log(`[Webhooks] Running at ${port}`)
  })
}

export default startWebhooks
