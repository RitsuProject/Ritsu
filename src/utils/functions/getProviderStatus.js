const phin = require('phin')

/**
 * Checks whether the provider is offline or online.
 * @async
 * @param {String} provider - The Provider.
 * @example
 * getProviderStatus("animethemes")
 * @example
 * getProviderStatus("openingsmoe")
 */

module.exports = async function getProviderStatus(provider) {
  const statusRes = await phin({
    method: 'GET',
    url: `${process.env.API_URL}/themes/status`,
    parse: 'json',
  })
  if (provider === 'animethemes') {
    if (statusRes.body.animethemes === 'offline') {
      return false
    } else {
      return true
    }
  } else if (provider === 'openingsmoe') {
    if (statusRes.body.openingsmoe === 'offline') {
      return false
    } else {
      return true
    }
  }
}
