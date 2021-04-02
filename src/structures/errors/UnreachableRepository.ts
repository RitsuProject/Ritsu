export default class UnreachableRepository extends Error {
  constructor(public repository: string) {
    super()
    this.name = 'UnreachableRepository'
    this.message = `${repository} cannot be reached.`
  }
}
