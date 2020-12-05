const phin = require('phin')
module.exports.getStream = async function getStream(url) {
  const response = await phin({
    method: 'GET',
    url: url,
    stream: true,
    timeout: 20000,
  })
  return response.stream
}
