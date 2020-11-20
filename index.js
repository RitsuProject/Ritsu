const { Ritsu } = require('./src/Ritsu')
const { readFileSync } = require('fs')

require('dotenv').config()

console.log(readFileSync('title.txt', 'utf8').toString())

const client = new Ritsu(process.env.TOKEN, {
  prefix: process.env.BOT_PREFIX,
})
client.start()
