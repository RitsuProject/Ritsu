import Game from '@handlers/GameHandler'
import MatchConfig from '@handlers/MatchSettingsHandler'
import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'

class Start extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'start',
      description: 'Start a Game!',
      category: 'Game',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, guild, locales }: CommandContext) {
    // TODO: Refactor this and try to get rid of all this "if's"
    const matchConfig = new MatchConfig(message, this.client, guild, locales)
    const gamemode = await matchConfig.getGamemode()
    if (!gamemode) return
    const rounds = await matchConfig.getRounds()
    if (!rounds) return
    const duration = await matchConfig.getDuration()
    if (!duration) return
    const themeType = await matchConfig.getThemesType()
    if (!themeType) return

    let animeListWebsite: string
    let animeListUsername: string
    let season: string
    let seasonYear: string

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

    const game = new Game(
      message,
      this.client,
      {
        mode: gamemode,
        rounds: rounds,
        time: duration.parsed,
        readableTime: duration.value,

        themeType: themeType,

        // Optional
        animeListUsername: animeListUsername,
        animeListWebsite: animeListWebsite,
        season: season,
        year: seasonYear,
      },
      locales
    )
    await game.initGame()
  }
}

export = Start
