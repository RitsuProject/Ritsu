import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

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
    this.client = client
  }

  async run(message: Message): Promise<void> {
    const dmChannel = await message.author.getDMChannel()
    let openDmChannel = true
    dmChannel
      .createMessage(
        'Thanks for wanting to add me! Here is the invite link! <invite here owo>'
      )
      .catch(() => {
        openDmChannel = false
        message.channel.createMessage(
          'It seems that your DM (Direct messages) is closed and that is why I was unable to send you the message.'
        )
      })
      .then(() => {
        if (openDmChannel) {
          message.channel.createMessage(
            'Could you have a look at your DM (Direct Messages) please?'
          )
        }
      })
  }
}

export = Invite
