/* eslint-disable @typescript-eslint/no-empty-function */
import RitsuClient from 'src/structures/RitsuClient'

interface Options {
  name: string
}

export default class RitsuEvent {
  public name: string
  constructor(_client: RitsuClient, options: Options) {
    this.name = options.name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(..._args) {}
}
