import { Message } from 'eris'
import { TFunction } from 'i18next'
import UnreachableRepository from '../../structures/errors/UnreachableRepository'
import Emojis from '../Emojis'

export default function handleError(
  message: Message,
  t: TFunction,
  error: Error | UnreachableRepository
) {
  console.log(error)
  if (error instanceof UnreachableRepository) {
    const embed = {
      title: t('errors:unreachableRepository.title', {
        emoji: ':warning:',
      }),
      description: t('errors:unreachableRepository.description', {
        invite: '[Support Server](https://discord.gg/XuDysZg)',
      }),
      color: 15547947,
    }
    void message.channel.createMessage({ embed })
    return
  }
  void message.channel.createMessage(
    t('errors:genericError', {
      emoji: Emojis.AQUA_CRYING,
      e: `\`error.message\``,
    })
  )
}
