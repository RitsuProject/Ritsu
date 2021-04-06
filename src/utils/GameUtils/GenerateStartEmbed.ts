import GameOptions from '@interfaces/GameOptions'
import { TFunction } from 'i18next'

export function generateStartEmbed(
  gameOptions: GameOptions,
  singleplayer: boolean,
  t: TFunction
) {
  const embed = {
    title: t('game:embeds.preparingMatch.title'),
    description:
      `${t('game:embeds.preparingMatch.fields.gamemode', {
        gamemode: gameOptions.mode.toUpperCase(),
      })}\n` +
      `${t('game:embeds.preparingMatch.fields.roundsNumber', {
        rounds: gameOptions.rounds,
      })}\n` +
      `${t('game:embeds.preparingMatch.fields.roundsDuration', {
        time: gameOptions.readableTime,
      })}\n` +
      `${t('game:embeds.preparingMatch.fields.matchMode', {
        mode: singleplayer ? 'Singleplayer' : 'Multiplayer',
      })}\n\n` +
      t('game:embeds.preparingMatch.description'),
    color: 16107281,
  }

  return embed
}

export function generateMinimalStartEmbed(t: TFunction) {
  const embed = {
    title: t('game:embeds.startingNextRound.title'),
    description: t('game:embeds.startingNextRound.description'),
    color: 16107281,
  }

  return embed
}

export function generateRoundStartedEmbed(
  currentRound: number,
  gameOptions: GameOptions,
  t: TFunction
) {
  const embed = {
    title: t('game:embeds.roundStarted.title', {
      currentRound: `#${currentRound}`,
    }),
    description: t('game:embeds.roundStarted.description', {
      themeType: `opening/ending`,
      time: `**\`${gameOptions.readableTime}\`**`,
    }),
    color: 3008016,
  }

  return embed
}
