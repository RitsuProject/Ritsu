import { readdir } from 'fs'
import { join } from 'path'
import RitsuClient from '../RitsuClient'
import RitsuEvent from '../RitsuEvent'

/**
 * Listener Manager
 * @desc Used to load all the events/listeners.
 */

export class ListenerManager {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    this.client = client
  }

  build() {
    readdir(join(__dirname, '..', '..', '/listeners'), (err, files) => {
      if (err) console.error(err)
      files.forEach(async (em) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Event = require(join(__dirname, '..', '..', '/listeners/', em))
        const event: RitsuEvent = new Event(this.client)
        this.client.on(event.name, (...args) => event.run(...args))
      })
    })
  }
}
