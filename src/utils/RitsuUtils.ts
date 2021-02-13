export default {
  randomIntBetween(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  randomValueInArray(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)]
  },
}
