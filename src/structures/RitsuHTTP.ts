import axios from 'axios'

export default axios.create({
  headers: {
    'User-Agent': `Ritsu, a Discord bot based on AnimeMusicQuiz | github.com/RitsuProject`,
  },
})
