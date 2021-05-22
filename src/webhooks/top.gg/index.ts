import { Request, Response } from 'express'

import DBLBody from '@interfaces/DBLBody'
import RitsuClient from '@structures/RitsuClient'
import UserService from '../../services/UserService'

export default async function handleDBL(
  req: Request<null, null, DBLBody>,
  res: Response,
  client: RitsuClient
) {
  if (!req.body.user)
    return res.status(400).json({
      code: 400,
      message: 'Missing User',
    })

  const userService = new UserService()

  const discordUser = client.users.get(req.body.user)
  const user = await userService.getUser(req.body.user)
  const dmChannel = await discordUser.getDMChannel()

  // If the user is a patreon supporter, will be added +2 cakes to him, if not, just one.
  if (user.patreonSupporter) {
    user.cakes = user.cakes + 2
  } else {
    user.cakes = user.cakes + 1
  }
  await user.save()

  const embed = {
    title: ':star: Thanks for voting!',
    description:
      'Thank you so much for giving me an upvote on top.gg! You have no idea how much it helps me.\n\n' +
      "Because of your incredible help, I will give you a gift! You've earned +1 Cake and can use it to get your amazing hints when you're having trouble guessing the anime!\n\n" +
      'Did you know that my patrons get more cakes when they upvote me? If you want, you can become one here! https://patreon.com/ritsubot\n\n' +
      'I hope you have a lot of fun! Goodbye!',
    color: 16755763, // Star Emoji Primary Color
  }

  await dmChannel.createMessage({ embed })

  return res.json({
    code: 200,
  })
}
