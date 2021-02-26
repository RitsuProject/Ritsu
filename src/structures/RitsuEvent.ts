import RitsuClient from 'src/structures/RitsuClient'

interface Options {
  name: string
}

export default abstract class RitsuEvent {
  public name: string
  constructor(_client: RitsuClient, options: Options) {
    this.name = options.name
  }

  abstract run(...args): void
}
