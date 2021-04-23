import mongoose from 'mongoose'

/**
 * Connect to the MongoDB
 * @description Little function to connect to the MongoDB database.
 * @param {String} uri - MongoDB Connection URL
 */
export default function mongoConnect(uri: string) {
  const connect = () => {
    mongoose
      .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        return console.log(`[Database] Successfully connected.`)
      })
      .catch((error) => {
        console.log('[Database] Error connecting to database: ', error)
        return process.exit(1)
      })
  }
  connect()

  mongoose.connection.on('disconnected', connect)
}
