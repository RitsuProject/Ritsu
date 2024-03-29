import { Message } from 'eris'
import { AnimeEntry } from 'anilist-node'
import { RoomDocument } from '@entities/Room'
import stringSimilarity from 'string-similarity'
import RoomLeaderboard from '@entities/RoomLeaderboard'
import { TFunction } from 'i18next'
import TimeElapsed from '@interfaces/TimeElapsed'

export default {
  async handleCollect(
    locales: TFunction,
    timeElapsed: TimeElapsed[],
    room: RoomDocument,
    msg: Message
  ) {
    if (!room.answerers.includes(msg.author.id)) {
      const userHaveLeaderboard = await RoomLeaderboard.findById(msg.author.id)
      if (!userHaveLeaderboard) {
        await new RoomLeaderboard({
          _id: msg.author.id,
          username: msg.author.username,
          guildId: msg.guildID,
        }).save()
      }

      const userTimeElapsed = timeElapsed.find(
        (user) => user.id === msg.author.id
      )

      room.answerers.push(msg.author.id)

      void msg.channel.createMessage(
        locales('game:roundWinner', {
          user: `<@${msg.author.id}>`,
          time: `**${userTimeElapsed.time}s**`,
        })
      )
      await msg.delete()
      await room.save()
    }
  },

  isAnswer(animeData: AnimeEntry, msg: Message) {
    const parsedMessage = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
    let score = 0

    const answers: Array<string> = []
    if (animeData.synonyms != null) {
      animeData.synonyms.forEach((synonym) => {
        answers.push(synonym)
      })
    }

    const titles = Object.values(animeData.title) as Array<string>
    titles.forEach((title) => {
      if (title !== null) {
        answers.push(title)
      }
    })

    answers.forEach((answer) => {
      // Let's compare all the titles!
      const similarity = stringSimilarity.compareTwoStrings(
        answer.toLowerCase().trim(),
        parsedMessage.toLowerCase().trim()
      )

      score = similarity > score ? similarity : score
    })
    return score > 0.45
  },

  isFakeCommand(prefix: string, msg: Message) {
    const command = msg.content.trim()
    return command.startsWith(prefix)
  },
}
