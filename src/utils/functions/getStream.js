const axios = require('axios')

module.exports.getStream = async function getStream(url) {
  const response = await axios
    .get(url, {
      responseType: 'stream',
      timeout: 20000,
    })
    .catch((e) => {
      if (e.response) {
        if (e.response.status === 404) return false
      }
      throw new Error(`Failed to fetch the stream. | ${e}`)
    })
  return response.data
}
