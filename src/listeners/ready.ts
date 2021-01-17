import RitsuClient from '../structures/RitsuClient'
import RitsuEvent from '../structures/RitsuEvent'

class Ready extends RitsuEvent {
  public client: RitsuClient
  constructor(client: RitsuClient) {
    super(client, {
      name: 'ready',
    })
    this.client = client
  }

  run() {
    this.client.editStatus('online', { name: 'ritsu!help | @Ritsu', type: 2 })
  }
}

export = Ready
