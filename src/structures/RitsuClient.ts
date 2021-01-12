import { Client, ClientOptions, Collection } from 'eris'
import { readdir } from 'fs'
import { join } from 'path'
import RitsuCommand from 'src/structures/RitsuCommand'
import RitsuEvent from 'src/structures/RitsuEvent'
import { CommandManager } from './managers/CommandManager'
import { ListenerManager } from './managers/ListenerManager'

/**
 * Ritsu Client
 * @desc Ritsu Core, who makes everything works.
 */
export default class RitsuClient extends Client {
  public commandManager: CommandManager = new CommandManager(this)
  public listenerManager: ListenerManager = new ListenerManager(this)
  constructor(token, options?: ClientOptions) {
    super(token, options)
  }

  async start() {
    this.commandManager.build()
    this.listenerManager.build()

    await this.connect()
  }
}
