import { Message } from 'eris'
import RitsuClient from 'src/structures/RitsuClient'
import GuildsInterface from '../../interfaces/GuildsInterface'
import RitsuCommand from '../../structures/RitsuCommand'

class Prefix extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'prefix',
      description: 'Change the guild prefix.',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message, args: Array<string>, guild: GuildsInterface) {
    if (!args[0])
      return message.channel.createMessage('You need to specify the prefix.')
    guild.prefix = args[0]
    guild.save()
    message.channel.createMessage(
      `The server prefix has been changed: ${args[0]}`
    )
  }
}

export = Prefix
