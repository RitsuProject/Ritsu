module.exports = class ready {
  constructor(client) {
    this.client = client
  }
  async run() {
    this.client.user.setActivity(
      `${
        process.env.VERSION === 'canary'
          ? 'javascript'
          : `ritsu!help | V.${require('../../package.json').version}`
      }`
    )
  }
}
