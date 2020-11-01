/**
 * Host Handler
 * @desc Responsible for choosing which host Ritsu will use.
 */
module.exports.HostHandler = class HostHandler {
  constructor() {}

  /**
   * Get Provider
   * @desc Catch a random host.
   * @return {String} Host
   */
  getProvider() {
    const providers = ['openingsmoe', 'animethemes']

    const provider = providers[Math.floor(Math.random() * providers.length)]

    return provider
  }
}
