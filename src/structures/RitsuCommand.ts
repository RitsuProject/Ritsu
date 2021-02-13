/* eslint-disable @typescript-eslint/no-empty-function */
import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import GuildsInterface from '../interfaces/GuildsInterface'

interface Options {
  name: string
  description: string
  category: string
  aliases: Array<string>
  fields?: Array<string>
  requiredPermissions?: Array<string>
  dev: boolean
}

export default class RitsuCommand {
  public client: RitsuClient
  public name: string
  public description: string
  public category: string
  public aliases: Array<string>
  public fields?: Array<string>
  public requiredPermissions?: Array<string>
  public dev: boolean
  constructor(client: RitsuClient, options: Options) {
    this.client = client
    this.name = options.name || null
    this.description = options.description || 'A command.'
    this.category = options.category || 'Game'
    this.aliases = options.aliases || []
    this.fields = options.fields || null
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(_message: Message, _args: Array<string>, _guild: GuildsInterface): void {}
}
