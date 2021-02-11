import { Command, Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import GuildsInterface from '../interfaces/GuildsInterface'

interface Options {
  name: string
  description: string
  aliases: Array<string>
  fields?: Array<string>
  requiredPermissions?: Array<string>
  dev: boolean
}

export default class RitsuCommand {
  public client: RitsuClient
  public name: string
  public description: string
  public aliases: Array<string>
  public fields?: Array<string>
  public requiredPermissions?: Object
  public dev: Boolean
  constructor(client: RitsuClient, options: Options) {
    this.client = client
    this.name = options.name || null
    this.description = options.description || 'A command.'
    this.aliases = options.aliases || []
    this.fields = options.fields || null
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }

  run(message: Message, args: Array<string>, guild: GuildsInterface) {}
}
