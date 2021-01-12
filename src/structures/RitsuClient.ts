import { Client, ClientOptions } from 'eris'
import { CommandManager } from './managers/CommandManager'
import { ListenerManager } from './managers/ListenerManager'

/**
 * Ritsu Client
 * @desc Ritsu Core, who makes everything works.
 */
export default class RitsuClient extends Client {
  public commandManager: CommandManager = new CommandManager(this)
  public listenerManager: ListenerManager = new ListenerManager(this)
  public env = process.env
  constructor(token: string, options?: ClientOptions) {
    super(token, options)
  }

  async start() {
    this.commandManager.build()
    this.listenerManager.build()

    await this.connect()
  }
}
