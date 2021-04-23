import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'

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

  run({ message, args, guild, t }: CommandContext) {
    if (!args[0])
      return message.channel.createMessage(t('commands:prefix.errors.noPrefix'))
    guild.prefix = args[0]
    void guild.save()
    void message.channel.createMessage(
      t('commands:prefix.changedPrefix', {
        newPrefix: `\`${args[0]}\``,
      })
    )
  }
}

export = Prefix
