import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'

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

  async run(context: RunArguments) {
    const dmChannel = await context.message.author.getDMChannel()
    let openDmChannel = true
    dmChannel
      .createMessage(
        'Thanks for wanting to add me! Here is the invite link! <invite here owo>'
      )
      .catch(() => {
        openDmChannel = false
        context.message.channel.createMessage(
          'It seems that your DM (Direct messages) is closed and that is why I was unable to send you the message.'
        )
      })
      .then(() => {
        if (openDmChannel) {
          context.message.channel.createMessage(
            'Could you have a look at your DM (Direct Messages) please?'
          )
        }
      })
  }
}

export = Invite
