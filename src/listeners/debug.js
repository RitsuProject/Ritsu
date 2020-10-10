module.exports = class debug {
  constructor(client) {
    this.client = client
  }
  async run(log) {
    if (!process.env.NODE_ENV === 'development') {
      console.log(log)
    }
  }
}
