export default class StreamError extends Error {
  constructor() {
    super()
    this.name = 'StreamError'
    this.message =
      'For some extremely nasty reason, I was unable to load the current stream of the theme and so I was unable to continue! Restart the game and try again.'
  }
}
