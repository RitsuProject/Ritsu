import Guilds from '../entities/Guild'
import Rooms from '../entities/Room'
import RitsuClient from '../structures/RitsuClient'
import RitsuEvent from '../structures/RitsuEvent'
import RitsuUtils from '../utils/RitsuUtils'

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

    const customStat = RitsuUtils.randomValueInArray(customStats)

    this.client.editStatus('online', customStat)

    setInterval(() => {
      const customStat = RitsuUtils.randomValueInArray(customStats)

      this.client.editStatus('online', customStat)
    }, 15000)
  }
}

export = Ready
