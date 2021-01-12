import { config } from 'dotenv'
import RitsuClient from './src/structures/RitsuClient'

config()
const client = new RitsuClient(process.env.DISCORD_TOKEN)

client.start().then(() => {
  console.log('Client Started')
})
