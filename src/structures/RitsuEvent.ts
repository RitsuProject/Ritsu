import RitsuClient from "src/structures/RitsuClient";

interface Options {
  name: string;
}

export default class RitsuEvent {
  public name: string;
  constructor(client: RitsuClient, options: Options) {
    this.name = options.name;
  }

  run(...args) {}
}
