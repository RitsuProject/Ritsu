import RitsuClient from 'src/structures/RitsuClient'
import User from '../../database/entities/User'
import { RitsuCommand, Context } from '../../structures/RitsuCommand'

class Bio extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'bio',
      description: 'Change your profile bio.',
      category: 'Social',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, args, t }: Context) {
    const user = await User.findById(message.author.id)
    if (!user) return

    const bio = args.slice(0).join(' ')
    if (!bio)
      return message.channel.createMessage(t('commands:bio.noBio'))

    user.bio = bio
    await user.save()
    message.channel.createMessage(t('commands:bio.changedBio'))
  }
}

export = Bio
