import { readdir } from 'fs'
import { join } from 'path'
import RitsuClient from '../RitsuClient'
import { RitsuEvent } from '../RitsuEvent'

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
      files.forEach(
        (em) =>
          void (async () => {
            /* Normally, the import of the event would return a object like this:
              { Ready: [class Ready extends RitsuEvent] }

              But you know, you can't give a new to an object, but in this case, 
              we can give it the value it has on the object because it is a class! 
              So we will only take the values!
            */

            const Event: (new (
              client: RitsuClient
            ) => RitsuEvent)[] = Object.values(
              await import(join(__dirname, '..', '..', '/listeners/', em))
            )

            const event = new Event[0](this.client)
            this.client.on(event.name, (...args) => event.run(...args))
          })()
      )
    })
  }
}
