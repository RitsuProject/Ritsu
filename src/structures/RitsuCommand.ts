import { Message } from 'eris'
import { TFunction } from 'i18next'
import { GuildDocument } from 'src/database/entities/Guild'
import RitsuClient from 'src/structures/RitsuClient'

interface Options {
  name: string
  description: string
  category: string
  aliases: Array<string>
  fields?: Array<string>
  requiredPermissions?: Array<string>
  dev: boolean
}

interface Context {
  message: Message
  args: Array<string>
  guild: GuildDocument
  t: TFunction
}

abstract class RitsuCommand {
  public name: string
  public description: string
  public category: string
  public aliases: Array<string>
  public fields?: Array<string>
  public requiredPermissions?: Array<string>
  public dev: boolean
  constructor(public client: RitsuClient, options: Options) {
    this.name = options.name || null
    this.description = options.description || 'A command.'
    this.category = options.category || 'Game'
    this.aliases = options.aliases || []
    this.fields = options.fields || null
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }

  abstract run(context: Context): void
}

export { RitsuCommand, Context }
