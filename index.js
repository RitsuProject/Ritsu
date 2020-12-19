const { Ritsu } = require('./src/client/RitsuClient')
const DBL = require('dblapi.js')
const { readFileSync } = require('fs')
const { logger } = require('./src/utils/logger')

require('dotenv').config()

console.log(readFileSync('title.txt', 'utf8').toString())

const client = new Ritsu(process.env.TOKEN, {
  prefix: process.env.BOT_PREFIX,
  disableMentions: 'everyone',
  fetchAllMembers: true,
})
client.start()
client.startSentry()
client.promServer.listen(8080)

// top.gg Post Server Count

if (process.env.VERSION === 'production') {
  const topGG = new DBL(process.env.DBL_TOKEN, client)
  topGG.on('posted', () => {
    logger.success('Yay ^ w ^! I successfully posted my new stats on top.gg.')
  })
}
