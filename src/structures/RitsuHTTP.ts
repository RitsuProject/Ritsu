import axios from 'axios'

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
  (e) => {
    console.log(`[HTTP REQUEST] Request to ${e.response.url} failed! \n${e}`)
  }
)

export default ritsuHTTP
