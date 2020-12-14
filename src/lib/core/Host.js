/**
 * Host Handler
 * @desc Responsible for choosing which host Ritsu will use.
 */
module.exports.Host = class Host {
  /**
   * Get Provider
   * @desc Catch a random host.
   * @return {String} Host
   */
  getProvider() {
    const providers = ['animethemes', 'openingsmoe']

    const provider = providers[Math.floor(Math.random() * providers.length)]

    return provider
  }
}
