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

  async run({ message, args, user, locales }: CommandContext) {
    const bio = args.slice(0).join(' ')
    if (!bio)
      return message.channel.createMessage(locales('commands:bio.noBio'))

    user.bio = bio
    await user.save()
    void this.reply(message, locales('commands:bio.changedBio'))
  }
}

export = Bio
