import { Message } from "eris";
import RitsuCommand from "../../structures/RitsuCommand";

class Ping extends RitsuCommand {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Pong!",
      dev: false,
      aliases: [],
    });
  }

  async run(message: Message) {
    message.channel.createMessage("owo");
  }
}

export = Ping;
