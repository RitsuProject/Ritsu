const chalk = require('chalk')

module.exports.log = function (message, fancyModule, error, color) {
  const log = console.log
  if (color) {
    switch (color) {
      case 'green': {
        log(`${chalk.black.bgGreen(`[${fancyModule}]`)} ${message}`)
      }
    }
  } else {
    if (!error) {
      log(`${chalk.black.bgWhite(`[${fancyModule}]`)} ${message}`)
    } else {
      log(`${chalk.black.bgRed(`[${fancyModule}]`)} ${message}`)
    }
  }
}
