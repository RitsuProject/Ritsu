import Guilds from '../models/Guild'
import Rooms from '../models/Room'
import RitsuClient from '../structures/RitsuClient'
import RitsuEvent from '../structures/RitsuEvent'
import randomValueInArray from '../utils/RandomValueInArray'

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

    const customStats = [
      { name: 'ritsu!help | @Ritsu', type: 2 },
      { name: 'patreon.com/ritsubot', type: 0 },
    ]

    const customStat = randomValueInArray(customStats)

    this.client.editStatus('online', customStat)

    setInterval(() => {
      const customStat = randomValueInArray(customStats)

      this.client.editStatus('online', customStat)
    }, 15000)
  }
}

export = Ready
