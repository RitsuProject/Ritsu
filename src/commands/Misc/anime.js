const { Command } = require('../../structures/Command')
const { Message, MessageEmbed } = require('discord.js')

const mal = require('mal-scraper')
const phin = require('phin')

module.exports = class Anime extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: 'anime',
      aliases: ['mal', 'myanimelist'],
      description: 'Search for a anime from MyaAnimeList.',
      requiredPermissions: null,
      dev: false,
    })
  }
  /**
   * Run
   * @param {Object} run
   * @param {Message} run.message
   * @param {Array} run.args
   */
  async run({ message, args }) {
    const search = args.slice(0).join(' ')
    if (!search)
      return message.channel.send(
        'You need to specify which anime you want to search for.'
      )

    const loading = await message.channel.send(
      '`Getting the data from this anime...`'
    )
    const animeData = await mal.getInfoFromName(search).catch((e) => {
      return message.channel.send('No anime was found under that name.')
    })
    await loading.delete()

    const synopsis =
      animeData.synopsis.length > 100
        ? animeData.synopsis.substring(0, 550 - 3) + '...'
        : animeData.synopsis

    // console.log(animeData.synonyms)
    let themes = []
    const themesResponse = await phin({
      method: 'GET',
      url: `https://themes.moe/api/themes/${animeData.id}`,
      parse: 'json',
    }).catch(() => {})

    if (themesResponse !== undefined || themesResponse.statusCode === 200) {
      themes = themesResponse.body[0].themes
    }

    const embed = new MessageEmbed()
    embed.setTitle(animeData.title)
    embed.setURL(animeData.url)
    embed.setColor('#2e51a2')
    embed.setDescription(synopsis)
    if (animeData.picture) {
      embed.setThumbnail(animeData.picture)
    }
    embed.addFields(
      { name: 'Type', value: animeData.type, inline: true },
      { name: 'Status', value: animeData.status, inline: true },
      {
        name: 'Trailer',
        value: `[Youtube](${animeData.trailer})`,
        inline: true,
      },
      { name: 'Score', value: animeData.score, inline: true },
      { name: 'Episodes', value: animeData.episodes, inline: true },
      { name: 'Source', value: animeData.source, inline: true },
      { name: 'Popularity', value: animeData.popularity, inline: true },
      { name: 'Rank', value: animeData.ranked, inline: true },
      { name: 'Members', value: animeData.members, inline: true },
      { name: 'Favorites', value: animeData.favorites, inline: true },
      {
        name: 'Synonyms',
        value:
          animeData.synonyms.length > 1
            ? animeData.synonyms.map((s) => s).join('\n ')
            : 'None',
        inline: true,
      },
      {
        name: 'Genres',
        value: animeData.genres.map((g) => g).join(', '),
        inline: true,
      },
      {
        name: 'Themes',
        value:
          themes.length > 0
            ? themes
                .map(
                  (t) =>
                    `[${t.themeName} [${t.themeType}]](${t.mirror.mirrorURL})`
                )
                .join('\n ')
            : 'None',
      }
    )

    message.channel.send(embed)
  }
}
