import RitsuClient from '@structures/RitsuClient'

import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'

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

  async run({ message, args, user, t }: CommandContext) {
    const bio = args.slice(0).join(' ')
    if (!bio) return message.channel.createMessage(t('commands:bio.noBio'))

    user.bio = bio
    await user.save()
    void message.channel.createMessage(t('commands:bio.changedBio'))
  }
}

export = Bio
