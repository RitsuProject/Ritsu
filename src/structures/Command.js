module.exports.Command = class Command {
  constructor(client, options) {
    this.client = client
    this.name = options.name || null
    this.description = options.description || 'A command.'
    this.aliases = options.aliases || []
    this.fields = options.fields || null
    this.requiredPermissions = options.requiredPermissions || null
    this.dev = options.dev || false
  }
}
