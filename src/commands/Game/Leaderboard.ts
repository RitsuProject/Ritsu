import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, Context } from '../../structures/RitsuCommand'
import User from '../../database/entities/User'
import Constants from '../../utils/Constants'
import { EmbedOptions } from 'eris'

class Leaderboard extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'leaderboard',
      description: 'See the actual Ritsu ranking by level.',
      category: 'Game',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, t }: Context) {
    const embed: EmbedOptions = {
      author: {
        name: t('commands:leaderboard.embed.title'),
        icon_url: message.author.avatarURL,
      },
      color: Constants.EMBED_COLOR_BASE,
      fields: [],
    }

    await User.find()
      .sort({ level: -1 })
      .limit(10)
      .then(async (results) => {
        for (const result in results) {
          const user = await this.client.users.get(results[result]._id)
          const fakeResult = parseInt(result)
          const rankNumber = fakeResult + 1

          if (user) {
            embed.fields.push({
              name: `${rankNumber}.${user.username}#${user.discriminator}`,
              value: `Level: **${results[result].level}**\nWon Matches: **${results[result].wonMatches}**`,
              inline: true,
            })
          } else {
            embed.fields.push({
              name: `${rankNumber}.Ghost (User is no longer in the cache)`,
              value: `Level: **${results[result].level}**\nWon Matches: **${results[result].wonMatches}**`,
              inline: true,
            })
          }
        }
      })

    message.channel.createMessage({ embed })
  }
}

export = Leaderboard
