const phin = require('phin')
module.exports.getStream = async function getStream(url) {
  const response = await phin({
    method: 'GET',
    url: url,
    stream: true,
    timeout: 20000,
  })
  // Just a dumb workaround when the op/end is unavailable (mainly on the fallback server)
  if (response.statusCode === 404) return false
  return response.stream
}
