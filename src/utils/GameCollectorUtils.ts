import { Message } from 'eris'
import { RoomDocument } from 'src/database/entities/Room'
import stringSimilarity from 'string-similarity'
import AnilistAnime from '../interfaces/AnilistAnime'

export default {
  async handleCollect(room: RoomDocument, msg: Message) {
    const authorID = msg.author.id
    if (!room.answerers.includes(authorID)) {
      room.answerers.push(authorID)

      const findInLeaderBoard = room.leaderboard.find((user) => {
        return user.id === authorID
      })
      if (findInLeaderBoard === undefined) {
        room.leaderboard.push({ id: authorID })
      }

      msg.channel.createMessage(`<@${authorID}> get the correct answer!`)
      await msg.delete()
      await room.save()
    }
  },

  isAnswer(animeData: AnilistAnime, msg: Message) {
    const parsedMessage = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
    let score = 0

    const answers: Array<string> = []
    if (animeData.synonyms != null) {
      animeData.synonyms.forEach((s) => {
        answers.push(s)
      })
    }

    const titles = Object.values(animeData.title)
    titles.forEach((t) => {
      if (t !== null) {
        answers.push(t)
      }
    })

    answers.forEach((a) => {
      // Let's compare all the titles!
      const similarity = stringSimilarity.compareTwoStrings(a, parsedMessage)
      score = similarity > score ? similarity : score
    })
    return score > 0.45
  },
}
