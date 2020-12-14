const mongoose = require('mongoose')
const { logger } = require('../utils/Logger')
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
        return logger
          .withTag('DATABASE')
          .success(`Successfully connected to the Database.`)
      })
      .catch((error) => {
        logger
          .withTag('DATABASE')
          .error(`Error connecting to database: ${error}`)
        return process.exit(1)
      })
  }
  connect()
  mongoose.connection.on('disconnected', connect)
}
