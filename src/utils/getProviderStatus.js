const phin = require('phin')

/**
 * Checks whether the provider is offline or online.
 * @param {String} provider - The Provider.
 * @exemple
 * getProviderStatus("animethemes")
 * @exemple
 * getProviderStatus("openingsmoe")
 */

module.exports = async function getProviderStatus(provider) {
  const statusRes = await phin({
    method: 'GET',
    url: 'https://ritsuapi.herokuapp.com/themes/status',
    parse: 'json',
  })
  if (provider === 'animethemes') {
    if (statusRes.body.animethemes === 'offline') {
      return true
    } else {
      return false
    }
  } else if (provider === 'openingsmoe') {
    if (statusRes.body.openingsmoe === 'offline') {
      return true
    } else {
      return false
    }
  }
}
