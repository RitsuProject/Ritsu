import { Message } from 'eris'
import { TFunction } from 'i18next'
import { GuildDocument } from '@entities/Guild'
import RitsuClient from '@structures/RitsuClient'
import { UserDocument } from '../database/entities/User'

interface CommandOptions {
  name: string
  description: string
  category: string
  aliases: string[]
  fields?: string[]
  requiredPermissions?: string[]
  dev: boolean
}

interface CommandContext {
  message: Message
  args: string[]
  guild: GuildDocument
  user: UserDocument
  locales: TFunction
}

abstract class RitsuCommand {
  public name: string
  public description: string
  public category: string
  public aliases: string[]
  public fields?: string[]
  public requiredPermissions?: Array<string>
  public dev: boolean
  constructor(public client: RitsuClient, options: CommandOptions) {
    this.name = options.name || null
    this.description = options.description || 'A command.'
    this.category = options.category || 'Game'
    this.aliases = options.aliases || []
    this.fields = options.fields || null
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }

  abstract run(context: CommandContext): void
}

export { RitsuCommand, CommandContext }
