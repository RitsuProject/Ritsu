module.exports = class ready {
  constructor(client) {
    this.client = client
  }
  async run() {
    this.client.user.setActivity(
      `${process.env.VERSION === "canary" ? "javascript" : `1, 2, 3...GO! | V.${require('../../package.json').version}`}`
    )
  }
}
