module.exports.getVideoUrl = function getVideoUrl(themeUrl) {
  const useFallback = process.env.USE_FALLBACK === 'true'

  let videoUrl = themeUrl

  if (useFallback) {
    videoUrl = themeUrl.replace(
      'https://animethemes.moe',
      process.env.FALLBACK_URL
    )
  }

  return videoUrl
}
