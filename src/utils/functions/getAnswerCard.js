const phin = require('phin')
module.exports.getAnswerCard = async function getAnswerCard(
  data,
  answer,
  type
) {
  const url = `${process.env.API_URL}/image/answser`
  const response = await phin({
    method: 'POST',
    url: url,
    data: {
      name: data.englishTitle ? data.englishTitle : answer,
      cover: data.picture,
      type: type,
      apiKey: process.env.API_KEY,
    },
  })
  return response.body
}
