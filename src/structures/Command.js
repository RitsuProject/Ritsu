module.exports.Command = class Command {
  constructor(client, options) {
    this.client = client
    this.name = options.name || null
    this.aliases = options.aliases || []
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }
}
