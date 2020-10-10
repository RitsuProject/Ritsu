const mongoose = require('mongoose')
const { log } = require('../utils/Logger')
module.exports = () => {
  const connect = () => {
    mongoose
      .connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return log(`Successfully connected.`, 'DATABASE', false)
      })
      .catch((error) => {
        log(`Error connecting to database: ${error}`, 'DATABASE', true)
        return process.exit(1)
      })
  }
  connect()
  mongoose.connection.on('disconnected', connect)
}
