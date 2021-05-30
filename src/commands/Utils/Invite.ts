import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'

class Invite extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'invite',
      description: 'Add me to your server!',
      category: 'Utils',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, locales }: CommandContext) {
    const dmChannel = await message.author.getDMChannel()
    let dmChannelIsOpen = true
    void dmChannel
      .createMessage(
        locales('commands:invite.thanks', {
          invite: 'https://ritsu.fun/invite',
        })
      )
      .catch(() => {
        dmChannelIsOpen = false
        void this.reply(message, locales('commands:invite.unavailableDM'))
      })
      .then(() => {
        if (dmChannelIsOpen) {
          void this.reply(message, locales('commands:invite.lookDM'))
        }
      })
  }
}

export = Invite
