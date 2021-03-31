import RitsuClient from '../../structures/RitsuClient'
import { Context, RitsuCommand } from '@structures/RitsuCommand'

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
  }

  async run({ message, guild }: Context) {
    const embed = {
      title: `:books:  Ritsu's Help`,
      color: 7506394,
      description: `Are you interested in my **commands**? Ooh, that's cool, feel free to see them down there.\n\nIf you have any questions, doubts or want support, do not hesitate to join **my support server**.`,
      thumbnail: { url: 'https://files.catbox.moe/d6758e.png' },
      fields: [
        {
          name: ':video_game: AnimeMusicQuiz',
          value: this.getCommandsByCategory(guild.prefix, 'Game'),
          inline: false,
        },
        {
          name: ':gear: Utilities',
          value: this.getCommandsByCategory(guild.prefix, 'Utils'),
          inline: false,
        },
        {
          name: ':ledger: Miscellaneous',
          value: this.getCommandsByCategory(guild.prefix, 'Miscellaneous'),
          inline: false,
        },
        {
          name: '🙇 Social',
          value: this.getCommandsByCategory(guild.prefix, 'Social'),
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
    void dmChannel
      .createMessage({
        content:
          'Join my server for more news, events, giveaways and more! We will love to hear your feedback. https://discord.gg/XuDysZg ',
        embed,
      })
      .catch(() => {
        openDmChannel = false
        void message.channel.createMessage(
          'It seems that your DM (Direct messages) is closed and that is why I was unable to send you the message.'
        )
      })
      .then(() => {
        if (openDmChannel) {
          void message.channel.createMessage(
            'Could you have a look at your DM (Direct Messages) please?'
          )
        }
      })
  }

  getCommandsByCategory(prefix: string, category: string): string {
    return this.client.commandManager.commands
      .filter((c) => !c.dev)
      .filter((c) => c.category === category)
      .map((c) => `\`${prefix}${c.name}\` - ${c.description}`)
      .join('\n ')
  }
}

export = Help
