import Collection from '@discordjs/collection'
import { readdir } from 'fs'
import { join } from 'path'
import RitsuClient from '../RitsuClient'
import { RitsuCommand } from '../RitsuCommand'

/**
 * Command Manager
 * @desc Used to load all the commands.
 */

export class CommandManager {
  public commands: Collection<string, RitsuCommand> = new Collection()
  public aliases: Collection<string, string> = new Collection()
  public client: RitsuClient

  constructor(client: RitsuClient) {
    this.commands = new Collection()
    this.aliases = new Collection()
    this.client = client
  }

  getCommand(commandName: string) {
    return (
      this.client.commandManager.commands.get(commandName) ||
      this.client.commandManager.commands.get(
        this.client.commandManager.aliases.get(commandName)
      )
    )
  }

  build(): void {
    readdir(join(__dirname, '..', '..', '/commands'), (err, files) => {
      if (err) console.error(err)
      files.forEach((category) => {
        readdir(
          join(__dirname, '..', '..', '/commands/', category),
          (err, cmd) => {
            if (err) return console.log(err)
            cmd.forEach(
              (cmd) =>
                void (async () => {
                  /* Normally, the import of the command would return a object like this:
                    { Ping: [class Ping extends RitsuCommand] }

                    But you know, you can't give a new to an object, but in this case, 
                    we can give it the value it has on the object because it is a class! 
                    So we will only take the values!
                  */

                  const Command: (new (
                    client: RitsuClient
                  ) => RitsuCommand)[] = Object.values(
                    await import(
                      join(__dirname, '..', '..', '/commands/', category, cmd)
                    )
                  )

                  const command = new Command[0](this.client)
                  this.commands.set(command.name, command)
                  command.aliases.forEach((alias) =>
                    this.aliases.set(alias, command.name)
                  )
                })()
            )
          }
        )
      })
    })
  }
}
