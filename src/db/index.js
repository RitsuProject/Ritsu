const mongoose = require('mongoose')
const { log } = require('../utils/logger')
mongoose.Promise = require('bluebird')
module.exports = () => {
  /**
   * Connect to the MongoDB database.
   */

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
