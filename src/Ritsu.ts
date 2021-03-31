import { config } from 'dotenv'
import { readFileSync } from 'fs'
import RitsuClient from '@structures/RitsuClient'
import startWebhooks from './webhooks'

config()
const client = new RitsuClient(process.env.DISCORD_TOKEN, {
  intents: ['guilds', 'guildMessages', 'guildVoiceStates'],
})

void client.start().then(() => {
  console.log(readFileSync('title.txt', 'utf8').toString())
  console.log('[Client] Connected to the wonderland.')
  console.log(
    `[Client] Loaded ${client.commandManager.commands.size} commands.`
  )
  startWebhooks(client)
})
