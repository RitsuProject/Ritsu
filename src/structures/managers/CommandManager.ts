import Collection from '@discordjs/collection'
import { readdir } from 'fs'
import { join } from 'path'
import RitsuClient from '../RitsuClient'
import RitsuCommand from '../RitsuCommand'

/**
 * Command Manager
 * @desc Used to load all the commands.
 */

export class CommandManager {
  public commands: Collection<string, RitsuCommand> = new Collection()
  public client: RitsuClient
  constructor(client: RitsuClient) {
    this.commands = new Collection()
    this.client = client
  }

  build(): void {
    readdir(join(__dirname, '..', '..', '/commands'), (err, files) => {
      if (err) console.error(err)
      files.forEach((category) => {
        readdir(
          join(__dirname, '..', '..', '/commands/', category),
          (err, cmd) => {
            if (err) return console.log(err)
            cmd.forEach((cmd) => {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const Command = require(join(
                __dirname,
                '..',
                '..',
                '/commands/',
                category,
                cmd
              ))
              const command: RitsuCommand = new Command(this.client)
              this.commands.set(command.name, command)
            })
          }
        )
      })
    })
  }
}
