import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'
import { TFunction } from 'i18next'
import User from '../../database/entities/User'
import Constants from '../../utils/Constants'

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
    this.client = client
  }

  async run(context: RunArguments, _, t: TFunction) {
    const embed = {
      author: {
        name: t('commands:leaderboard.embed.title'),
        icon_url: context.message.author.avatarURL,
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

    context.message.channel.createMessage({ embed })
  }
}

export = Leaderboard
