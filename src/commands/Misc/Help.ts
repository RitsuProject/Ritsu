import { EmbedOptions, Message } from 'eris'
import Emojis from '../../utils/Emojis'
import Guilds from '../../database/entities/Guild'
import RitsuClient from '../../structures/RitsuClient'
import RitsuCommand from '../../structures/RitsuCommand'
import GuildsInterface from '../../interfaces/GuildsInterface'

class Help extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'help',
      description: 'This command!',
      category: 'Miscellaneous',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
    this.client = client
  }

  async run(message: Message, _, guild: GuildsInterface) {
    const embed: EmbedOptions = {
      title: `:books:  Ritsu's Help`,
      color: 7506394,
      description: `Are you interested in my **commands**? Ooh, that's cool, feel free to see them down there.\n\nIf you have any questions, doubts or want support, do not hesitate to join **my support server**.`,
      thumbnail: { url: 'https://files.catbox.moe/d6758e.png' },
      fields: [
        {
          name: ':video_game: AnimeMusicQuiz',
          value: this.getCommandsByCategory(guild.prefix, 'Game'),
          inline: true,
        },
        {
          name: ':ledger: Miscellaneous',
          value: this.getCommandsByCategory(guild.prefix, 'Miscellaneous'),
          inline: true,
        },
        {
          name: ':gear: Utilites',
          value: this.getCommandsByCategory(guild.prefix, 'Utils'),
          inline: false,
        },
      ],
      footer: {
        text:
          'You can get more information about the commands at https://ritsu.fun/commands',
      },
    }
    const dmChannel = await message.author.getDMChannel()
    let openDmChannel = true
    dmChannel
      .createMessage({
        content:
          'Join my server for more news, events, giveaways and more! We will love to hear your feedback. https://discord.gg/XuDysZg ',
        embed,
      })
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

  getCommandsByCategory(prefix: string, category: string) {
    return this.client.commandManager.commands
      .filter((c) => !c.dev)
      .filter((c) => c.category === category)
      .map((c) => `\`${prefix}${c.name}\` - ${c.description}`)
      .join('\n ')
  }
}

export = Help
