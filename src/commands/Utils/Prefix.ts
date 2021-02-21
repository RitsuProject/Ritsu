import { GuildDocument } from 'src/database/entities/Guild'
import RitsuClient from 'src/structures/RitsuClient'
import { RitsuCommand, RunArguments } from '../../structures/RitsuCommand'

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
    this.client = client
  }

  async run(context: RunArguments, guild: GuildDocument) {
    if (!context.args[0])
      return context.message.channel.createMessage(
        'You need to specify the prefix.'
      )
    guild.prefix = context.args[0]
    guild.save()
    context.message.channel.createMessage(
      `The server prefix has been changed: ${context.args[0]}`
    )
  }
}

export = Prefix
