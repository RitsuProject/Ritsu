export default interface MioSong {
  name: string
  link: string
  type: 'OP' | 'ED'
  songName: string
  songArtists: Array<String | Object>
}
