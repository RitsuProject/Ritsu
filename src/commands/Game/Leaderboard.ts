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

    const results = await User.find()
      .sort({ level: -1 })
      .limit(10)
      .select('wonMatches level')
      .lean()

    results.forEach((result, rank) => {
      const user = this.client.users.get(result._id)
      user
        ? embed.fields.push({
            name: `${rank + 1}.${user.username}#${user.discriminator}`,
            value: `Level: **${result.level}**\nWon Matches: **${result.wonMatches}**`,
            inline: true,
          })
        : embed.fields.push({
            name: `${rank + 1}.Ghost (User is no longer in the cache)`,
            value: `Level: **${result.level}**\nWon Matches: **${result.wonMatches}**`,
            inline: true,
          })
    })

    void message.channel.createMessage({ embed })
  }
}

export = Leaderboard
