const p = require('phin')

/**
 * Post a new number of servers to discordbotlist.com
 * @async
 * @param {Number} number - Number of servers.
 * @exemple
 * await botListPost(30)
 */

module.exports.botListPost = async function botListPost(number) {
  await p({
    method: 'POST',
    url: 'https://discordbotlist.com/api/v1/bots/763934732420382751/stats',
    headers: {
      Authorization: process.env.BOTLIST_TOKEN,
    },
    data: {
      guilds: number,
    },
  })
}
