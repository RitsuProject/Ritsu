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
    const matchConfigHandler = new MatchConfig(
      this.client,
      message,
      guild,
      locales
    )
    const matchConfig = await matchConfigHandler.getMatchSettings()

    const game = new Game(
      message,
      this.client,
      {
        mode: matchConfig.gamemode,
        rounds: matchConfig.rounds,
        time: matchConfig.duration.parsed,
        readableTime: matchConfig.duration.value,

        themeType: matchConfig.themeType,

        // Optional
        animeListUsername: matchConfig.animeListUsername,
        animeListWebsite: matchConfig.animeListWebsite,
        season: matchConfig.season,
        year: matchConfig.seasonYear,
      },
      locales
    )
    await game.initGame()
  }
}

export = Start
