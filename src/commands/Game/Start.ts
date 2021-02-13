import { Message } from 'eris'
import Game from '../../handlers/GameHandler'
import MatchConfig from '../../handlers/MatchSettingsHandler'
import RitsuClient from '../../structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

class Start extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'start',
      description: 'Start a Game!',
      category: "Game",
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message): Promise<void> {
    const matchConfig = new MatchConfig(message, this.client)
    const gamemode = await matchConfig.getGamemode()
    if (!gamemode) return
    const rounds = await matchConfig.getRounds()
    if (!rounds) return
    const duration = await matchConfig.getDuration()
    if (!duration) return

    let animeListWebsite: string = null
    let animeListUsername: string = null
    let season: string = null
    let seasonYear: string = null

    if (gamemode === 'list') {
      animeListWebsite = await matchConfig.getListWebsite()
      if (!animeListWebsite) return
      animeListUsername = await matchConfig.getListUsername(animeListWebsite)
      if (!animeListUsername) return
    } else if (gamemode === 'season') {
      const seasonObject = await matchConfig.getSeason()
      if (!seasonObject) return

      season = seasonObject.season
      seasonYear = seasonObject.year
    }

    const game = new Game(message, this.client, {
      mode: gamemode,
      rounds: rounds,
      time: duration.parsed,
      readableTime: duration.value,

      // Optional
      animeListUsername: animeListUsername,
      animeListWebsite: animeListWebsite,
      season: season,
      year: seasonYear,
    })
    await game.init()
  }
}

export = Start
