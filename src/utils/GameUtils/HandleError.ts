import { Message } from 'eris'
import { TFunction } from 'i18next'
import UnreachableRepository from '../../structures/errors/UnreachableRepository'
import Emojis from '../Emojis'

export default function handleError(
  message: Message,
  locales: TFunction,
  error: Error | UnreachableRepository
) {
  console.log(error)
  if (error instanceof UnreachableRepository) {
    const embed = {
      title: locales('errors:unreachableRepository.title', {
        emoji: ':warning:',
      }),
      description: locales('errors:unreachableRepository.description', {
        invite: '[Support Server](https://discord.gg/XuDysZg)',
      }),
      color: 15547947,
    }
    void message.channel.createMessage({ embed })
    return
  }
  void message.channel.createMessage(
    locales('errors:genericError', {
      emoji: Emojis.AQUA_CRYING,
      e: `\`${error.message}\``,
    })
  )
}
