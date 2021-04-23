import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'
import User from '@entities/User'
import Constants from '@utils/Constants'
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

  async run({ message, t }: CommandContext) {
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
      const positionNumber = rank + 1

      const position =
        positionNumber === 1
          ? '🥇'
          : positionNumber === 2
          ? '🥈'
          : positionNumber === 3
          ? '🥉'
          : `${positionNumber}.`

      const username = user
        ? `${user.username}#${user.discriminator}`
        : result.name

      embed.fields.push({
        name: `${position} ${username}`,
        value: t('commands:leaderboard.embed.levelAndWonMatches', {
          wonMatches: result.wonMatches,
          level: result.level,
        }),
      })
    })

    void message.channel.createMessage({ embed })
  }
}

export = Leaderboard
