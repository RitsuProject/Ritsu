import RitsuClient from '@structures/RitsuClient'

interface Options {
  name: string
}

export abstract class RitsuEvent {
  public name: string
  constructor(public client: RitsuClient, options: Options) {
    this.name = options.name
  }

  abstract run(...args: unknown[]): void
}
