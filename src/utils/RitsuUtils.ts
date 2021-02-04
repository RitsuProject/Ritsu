export default {
  randomIntBetween(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  },

  randomValueInArray(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)]
  },
}
