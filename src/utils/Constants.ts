import Emojis from '@utils/GameUtils/Emojis'

export default {
  DEFAULT_ERROR_MESSAGE: `${Emojis.AQUA_CRYING} | Oopsie! **A critical failure** happened and therefore **I was unable to continue/start the match!** If you think this should not be happening, contact us on the **Ritsu support server**! \n\`$e\``,
  EMBED_COLOR_HEX: '#ff3860',
  EMBED_COLOR_BASE: 16726112,

  // Useful Regex
  REMOVE_HTML_TAGS: /(<br>|<i>|<\/i>|<strong>|<\/strong>)/g,
}
