const chalk = require('chalk')

/**
 * Logger
 * @desc - Used to send colorful messages to the console (because it's beautiful and I like things like that)
 * @param {String} message - The message.
 * @param {String} fancyModule - The module.
 * @param {String} [error] - If it is an error, specify its message here.
 * @param {String} [color] - If you want to specify the color, use this parameter.
 */
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
