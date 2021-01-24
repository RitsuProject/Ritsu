import Guilds from '../models/Guild'
import Rooms from '../models/Room'
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

  async run() {
    await Guilds.updateMany({}, { rolling: false, currentChannel: null })
    await Rooms.deleteMany({})
    this.client.editStatus('online', { name: 'ritsu!help | @Ritsu', type: 2 })
  }
}

export = Ready
