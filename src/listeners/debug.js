module.exports = class debug {
  constructor(client) {
    this.client = client
  }
  async run(log) {
    if (process.env.VERSION === 'canary') {
      // console.log(log)
      // Enable if you want to debug something.
    }
  }
}
