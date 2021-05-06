import { Message } from 'eris'
import { UserDocument } from '@entities/User'
import Constants from '@utils/Constants'
import HintsHandler from './HintsHandler'
import RitsuClient from '../structures/RitsuClient'
import { MessageCollector } from 'eris-collector'
import { RoomDocument } from '../database/entities/Room'
import { TFunction } from 'i18next'

export default class GameCommandHandler {
  public client: RitsuClient
  public message: Message
  public t: TFunction
  public prefix: string
  constructor(
    client: RitsuClient,
    message: Message,
    t: TFunction,
    prefix: string
  ) {
    this.client = client
    this.message = message
    this.t = t
    this.prefix = prefix
  }

  async handleStopCommand(
    room: RoomDocument,
    answerCollector: MessageCollector
  ) {
    if (this.message.author.id !== room.startedBy)
      return this.message.channel.createMessage(
        this.t('game:errors.onlyHostCanFinish')
      )

    void this.message.channel.createMessage(this.t('game:forceFinished'))
    answerCollector.stop('forceFinished')
  }

  async handleHintCommand(user: UserDocument, hintsHandler: HintsHandler) {
    if (user.cakes < 1)
      return this.message.channel.createMessage(
        this.t('game:embeds.hint.noSufficientCakes')
      )
    const hint = hintsHandler.generateHint()
    const embed = {
      title: this.t('game:embeds.hint.title', {
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
