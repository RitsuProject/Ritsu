import axios, { AxiosError } from 'axios'

const ritsuHTTP = axios.create({
  headers: {
    'User-Agent': `Ritsu, a Discord bot based on AnimeMusicQuiz | github.com/RitsuProject`,
  },
})

ritsuHTTP.interceptors.request.use(
  (config) => {
    console.log(`[HTTP REQUEST] ${config.method.toUpperCase()} - ${config.url}`)
    return config
  },
  (e: AxiosError) => {
    console.log(
      `[HTTP REQUEST] Request to ${
        e && e.response ? e.response.config.url : '[URL Unknown]'
      } failed! \n${e}`
    )
  }
)

export default ritsuHTTP
