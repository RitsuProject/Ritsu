import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, CommandContext } from '@structures/RitsuCommand'
import util from 'util'

class Eval extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'eval',
      description: '',
      category: 'Development',
      dev: true,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, args }: CommandContext) {
    try {
      // eslint-disable-next-line no-eval
      let evaluatedResponse = util.inspect(await eval(args.join(' ')))

      // Remove any piece of the bot token from the response.
      evaluatedResponse = evaluatedResponse.replace(
        new RegExp(`${process.env.DISCORD_TOKEN}`, 'g'),
        'I_LOVE_NEKO_GIRLS'
      )

      // Respect Discord Character Limit
      if (evaluatedResponse.length > 1800) {
        evaluatedResponse = `${evaluatedResponse.slice(0, 1800)}...`
      }

      void this.reply(message, `\`\`\`js\n${evaluatedResponse}\`\`\``)
    } catch (e) {
      void this.reply(message, `Error. ${e}`)
    }
  }
}

export = Eval
