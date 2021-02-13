import Eris, { Client, ClientOptions } from 'eris'
import { CommandManager } from './managers/CommandManager'
import { ListenerManager } from './managers/ListenerManager'
import mongoConnect from '../database/MongoConnect'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('eris-additions')(Eris)

/**
 * Ritsu Client
 * @desc Ritsu Core, who makes everything works.
 */
export default class RitsuClient extends Client {
  public commandManager: CommandManager = new CommandManager(this)
  public listenerManager: ListenerManager = new ListenerManager(this)
  public enabledGamemodes: Array<string> = [
    'easy',
    'normal',
    'hard',
    'list',
    'season',
  ]

  // eslint-disable-next-line no-useless-constructor
  constructor(token: string, options?: ClientOptions) {
    super(token, options)
  }

  async start(): Promise<void> {
    mongoConnect(process.env.MONGODB_URI) // Connect to the MongoDB Cluster.
    this.commandManager.build() // Build/Load all the commands.
    this.listenerManager.build() // Build/Load all the listeners.

    await this.connect() // And now, connect to the wonderland!
  }
}
