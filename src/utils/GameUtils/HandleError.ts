import { Message } from 'eris'
import { TFunction } from 'i18next'
import UnreachableRepository from '../../structures/errors/UnreachableRepository'

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
      e: error.message,
    })
  )
}
