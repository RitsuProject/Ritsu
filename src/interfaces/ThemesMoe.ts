export default interface ThemesMoeTheme {
  themeType: string
  themeName: string
  mirror: {
    mirrorURL: string
    priority: number
    notes: string
  }
}

export default interface ThemesMoeAnime {
  malID: number
  name: string
  year: number
  season: string
  themes: Array<ThemesMoeTheme>
  watchStatus: number
}
