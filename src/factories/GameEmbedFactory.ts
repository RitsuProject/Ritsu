import { TFunction } from 'i18next'
import GameOptions from '@interfaces/GameOptions'
import MioSong from '../interfaces/MioSong'
import { AnimeEntry } from 'anilist-node'

import Vibrant from 'node-vibrant/lib/index'
import Constants from '@utils/Constants'

/**
 * Embed Factory
 * @description Create the game embeds (like the answer embed) with all the pre-defined parameters.
 */
export default class GameEmbedFactory {
  constructor(
    private gameOptions: GameOptions,
    private singleplayer: boolean,
    private t: TFunction
  ) {
    this.gameOptions = gameOptions
    this.singleplayer = singleplayer
    this.t = t
  }

  async answerEmbed(theme: MioSong, animeData: AnimeEntry) {
    // Get the vibrant color from the anime cover image
    const ImageColor = await Vibrant.from(
      animeData.coverImage.medium
    ).getPalette()
    const imageColorHex = ImageColor.Vibrant.hex.replace('#', '')
    const imageColorAndroid = parseInt(imageColorHex, 16)

    // Remove all the <i></i> and <br> tags.
    const synopsis =
      animeData.description.length > 100
        ? animeData.description
            .replace(Constants.REMOVE_HTML_TAGS, '')
            .substring(0, 250 - 3) + '...'
        : animeData.description.replace(Constants.REMOVE_HTML_TAGS, '')

    const alternateTitles = `${animeData.title.romaji}\n${animeData.title.native}`
    const synonyms =
      animeData.synonyms && animeData.synonyms.length > 1
        ? animeData.synonyms.map((s) => s).join('\n ')
        : ''

    // Sometimes, the anime title in english is null.
    const embedTitle = animeData.title.english
      ? animeData.title.english
      : animeData.title.romaji

    const embed = {
      title: `${embedTitle} (${theme.type})`,
      description: `${synopsis}`,
      fields: [
        {
          name: this.t('game:embeds.answerEmbed.fields.season'),
          value: `${animeData.season}`,
          inline: true,
        },
        {
          name: this.t('game:embeds.answerEmbed.fields.year'),
          value: `${animeData.seasonYear}`,
          inline: true,
        },
        {
          name: this.t('game:embeds.answerEmbed.fields.titlesAndSynonyms'),
          value: `${alternateTitles}\n${synonyms}`,
          inline: true,
        },
      ],
      image: { url: animeData.coverImage.large },
      color: imageColorAndroid,
      footer: {
        text: this.t('game:embeds.answerEmbed.footer', {
          songName: theme.songName,
          songArtist: theme.songArtists.map((artist) => artist).join(', '),
        }),
      },
    }

    return embed
  }

  preparingMatch() {
    const embed = {
      title: this.t('game:embeds.preparingMatch.title'),
      description:
        `${this.t('game:embeds.preparingMatch.fields.gamemode', {
          gamemode: this.gameOptions.mode.toUpperCase(),
        })}\n` +
        `${this.t('game:embeds.preparingMatch.fields.roundsNumber', {
          rounds: this.gameOptions.rounds,
        })}\n` +
        `${this.t('game:embeds.preparingMatch.fields.roundsDuration', {
          time: this.gameOptions.readableTime,
        })}\n` +
        `${this.t('game:embeds.preparingMatch.fields.matchMode', {
          mode: this.singleplayer ? 'Singleplayer' : 'Multiplayer',
        })}\n\n` +
        this.t('game:embeds.preparingMatch.description'),
      color: 16107281,
    }

    return embed
  }

  startingNextRound() {
    const embed = {
      title: this.t('game:embeds.startingNextRound.title'),
      description: this.t('game:embeds.startingNextRound.description'),
      color: 16107281,
    }

    return embed
  }

  roundStarted(currentRound: number) {
    const embed = {
      title: this.t('game:embeds.roundStarted.title', {
        currentRound: `#${currentRound}`,
      }),
      description: this.t('game:embeds.roundStarted.description', {
        themeType: `opening/ending`,
        time: `**\`${this.gameOptions.readableTime}\`**`,
      }),
      color: 3008016,
    }

    return embed
  }
}
