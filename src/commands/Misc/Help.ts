import { Message } from 'eris'
import Emojis from '../../utils/Emojis'
import Guilds from '../../models/Guild'
import RitsuClient from '../../structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'

class Help extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'help',
      description: 'This command!',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message) {
    const guild = await Guilds.findById(message.guildID)
    message.channel.createMessage({
      embed: {
        title: `${Emojis.BLOBBLUSH} Ritsu's Help`,
        color: 3442411,
        description: `Are you interested in my **commands**? Ooh, that's cool, feel free to see them down there.\n\nIf you have any questions, doubts or want support, do not hesitate to join **my support server**.`,
        fields: [
          {
            name: 'Commands',
            value: this.getCommands(guild.prefix),
          },
        ],
      },
    })
  }

  getCommands(prefix: string) {
    return this.client.commandManager.commands
      .filter((c) => !c.dev)
      .map(
        (c) =>
          `\`${prefix}${c.name} ${
            c.fields === null
              ? ''
              : `${c.fields.map((f) => `<${f}>`).join(' ')}`
          }\` - ${c.description}`
      )
      .join('\n ')
  }
}

export = Help
