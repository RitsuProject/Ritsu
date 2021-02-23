import { TFunction } from 'i18next'
import RitsuClient from 'src/structures/RitsuClient'
import User from '../../database/entities/User'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'

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
    this.client = client
  }

  async run(context: RunArguments, _, t: TFunction) {
    const user = await User.findById(context.message.author.id)
    if (!user) return

    const bio = context.args.slice(0).join(' ')
    if (!bio)
      return context.message.channel.createMessage(t('commands:bio.noBio'))

    user.bio = bio
    await user.save()
    context.message.channel.createMessage(t('commands:bio.changedBio'))
  }
}

export = Bio
