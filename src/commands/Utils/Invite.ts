import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, Context } from '@structures/RitsuCommand'

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

  async run({ message, t }: Context) {
    const dmChannel = await message.author.getDMChannel()
    let openDmChannel = true
    void dmChannel
      .createMessage(
        t('commands:invite.thanks', {
          invite: 'https://ritsu.fun/invite',
        })
      )
      .catch(() => {
        openDmChannel = false
        void message.channel.createMessage(t('commands:invite.unavailableDM'))
      })
      .then(() => {
        if (openDmChannel) {
          void message.channel.createMessage(t('commands:invite.lookDM'))
        }
      })
  }
}

export = Invite
