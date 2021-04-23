import { AnimeEntry } from 'anilist-node'
import Constants from '@utils/Constants'
import RitsuUtils from '@utils/RitsuUtils'
import { TFunction } from 'i18next'

/**
 * HintsHandler
 * @description Handle all the hint generation to be used in ritsu!hint.
 */
export default class HintsHandler {
  constructor(private animeData: AnimeEntry, private t: TFunction) {
    this.animeData = animeData
    this.t = t
  }

  generateHint() {
    const hintsTypes = ['synopsis', 'firstCharacter']
    const animeTitle = this.animeData.title.english
    const whiteSpaceRegex = /\s/g
    // If the title has white spaces, other hints types will be available
    if (whiteSpaceRegex.test(animeTitle)) {
      hintsTypes.push('startsWith')
      hintsTypes.push('endsWith')
    }
    const hintType = RitsuUtils.randomValueInArray(hintsTypes)

    switch (hintType) {
      case 'synopsis': {
        const synopsis =
          this.animeData.description
            .replace(Constants.REMOVE_HTML_TAGS, '')
            .substring(0, 150 - 3) + '...'
        return synopsis
      }
      case 'firstCharacter': {
        const firstCharacter = animeTitle.charAt(0)

        return this.t('gameHints:firstCharacter', {
          character: firstCharacter,
        })
      }
      case 'startsWith': {
        const firstWord = animeTitle.split(' ')[0]

        return this.t('gameHints:startsWith', {
          firstWord: firstWord,
        })
      }
      case 'endsWith': {
        const wordsArray = animeTitle.split(' ')
        const lastWord = wordsArray.slice(-1)[0]

        return this.t('gameHints:endsWith', {
          lastWord: lastWord,
        })
      }
    }
  }
}
