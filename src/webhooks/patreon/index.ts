import { Request, Response } from 'express'
import crypto from 'crypto'
import User from '../../database/entities/User'
import RitsuClient from '../../structures/RitsuClient'
import { EmbedOptions } from 'eris'
import Constants from '../../utils/Constants'

export default async function Patreon(
  req: Request,
  res: Response,
  client: RitsuClient
) {
  // Check if the message is from...patreon owo
  const hash = req.header('X-Patreon-Signature')
  if (!hash)
    return res.status(400).json({
      code: 400,
      message: 'Where is the Signature Header?',
    })
  const encrypted = crypto
    .createHmac('md5', process.env.PATREON_SECRET)
    .update(req.rawBody)
    .digest('hex')

  console.log(`ENCRYPTED: ${encrypted} | SPECIFIED HASH: ${hash}`)

  if (encrypted !== hash)
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized, fuck you onii-chan.', // maybe i'm crazy
      specified_hash: hash,
    })

  const userDiscordId: string = req.body.included[1].attributes.discord_id
  const chargeStatus: string = req.body.data.attributes.last_charge_status
  const patreonUsername: string = req.body.data.attributes.full_name
  const lastChargeDate: string = req.body.data.attributes.last_charge_date

  // Check if user has a Discord Account linked and the charge status as Paid
  if (userDiscordId && chargeStatus === 'Paid') {
    const user = await User.findById(userDiscordId)
    if (user) {
      user.patreonSupporter = true
      await user.save()
    }

    const discordUser = client.users.get(userDiscordId)

    if (discordUser) {
      const dmChannel = await discordUser.getDMChannel()

      const patreonDetails = `\`\`\`md\n# Patreon Username: ${patreonUsername}\n# Last Charge Date: ${lastChargeDate}
      \`\`\``

      const embed = {
        title: 'Patreon Notice',
        description: `Hi! Thank you so much for becoming my new Patron! This helps me a lot to stay strong and mainly to pay my bills!
          
          **Some details about your incredible subscription to my Patreon**: ${patreonDetails}
          
          Some advantages may depend on you contacting my support server to receive them, if something is wrong there will be the most correct place for you to inform us!
          Thank you very much for helping the project! I hope you have a lot of fun~~
          
          **sazz,**
          *Core Developer*`,
        color: Constants.EMBED_COLOR_BASE,
      }

      dmChannel.createMessage({ embed })
    }

    return res.json({
      code: 200,
      message: 'OK',
    })
  } else {
    return res.status(400).json({
      code: 400,
      message: 'Invalid Charge Status/Discord Account.',
    })
  }
}
