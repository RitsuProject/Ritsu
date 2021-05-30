export default class InvalidMatchConfig extends Error {
  constructor(public message: string, public example: string) {
    super()
    this.name = 'InvalidMatchConfig'
    this.example = example
    this.message = message
  }
}
