import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, Context } from '../../structures/RitsuCommand'

class Prefix extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'prefix',
      description: 'Change the guild prefix.',
      category: 'Utils',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, args, guild }: Context) {
    if (!args[0])
      return message.channel.createMessage(
        'You need to specify the prefix.'
      )
    guild.prefix = args[0]
    guild.save()
    message.channel.createMessage(
      `The server prefix has been changed: ${args[0]}`
    )
  }
}

export = Prefix
