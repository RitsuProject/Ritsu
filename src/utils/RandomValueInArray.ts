export default function randomValueInArray(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)]
}
