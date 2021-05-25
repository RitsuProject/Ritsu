import { Message } from 'eris'
import { UserDocument } from '@entities/User'
import Constants from '@utils/Constants'
import HintsHandler from './HintsHandler'
import RitsuClient from '../structures/RitsuClient'
import { MessageCollector } from 'eris-collector'
import { RoomDocument } from '@entities/Room'
import { TFunction } from 'i18next'

export default class GameCommandHandler {
  public client: RitsuClient
  public message: Message
  public locales: TFunction
  public prefix: string

  constructor(
    client: RitsuClient,
    message: Message,
    locales: TFunction,
    prefix: string
  ) {
    this.client = client
    this.message = message
    this.locales = locales
    this.prefix = prefix
  }

  async handleStopCommand(
    room: RoomDocument,
    answerCollector: MessageCollector
  ) {
    if (this.message.author.id !== room.startedBy)
      return this.message.channel.createMessage(
        this.locales('game:errors.onlyHostCanFinish')
      )

    void this.message.channel.createMessage(this.locales('game:forceFinished'))
    answerCollector.stop('forceFinished')
  }

  async handleHintCommand(user: UserDocument, hintsHandler: HintsHandler) {
    if (user.cakes < 1)
      return this.message.channel.createMessage(
        this.locales('game:embeds.hint.noSufficientCakes')
      )
    const hint = hintsHandler.generateHint()
    const embed = {
      title: this.locales('game:embeds.hint.title', {
        emoji: ':question:',
      }),
      description: `**\`${hint}\`**`,
      color: Constants.EMBED_COLOR_BASE,
    }

    user.cakes = user.cakes - 1
    await user.save()
    await this.message.channel.createMessage({ embed })
  }
}
