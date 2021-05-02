import Emojis from '@utils/Emojis'

export default {
  DEFAULT_ERROR_MESSAGE: `${Emojis.AQUA_CRYING} | Oopsie! **A critical failure** happened and therefore **I was unable to continue/start the match!** If you think this should not be happening, contact us on the **Ritsu support server**! \n\`$e\``,
  EMBED_COLOR_HEX: '#ff3860',
  EMBED_COLOR_BASE: 16726112,

  INVITE_URL:
    'https://discord.com/oauth2/authorize/?permissions=3145728&scope=bot&client_id=763934732420382751',

  // Useful Regex
  REMOVE_HTML_TAGS: /(<br>|<i>|<\/i>|<strong>|<\/strong>)/g,
}
