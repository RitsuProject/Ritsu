const { Consola, FancyReporter } = require('consola')

module.exports.logger = new Consola({
  level: 5,
  reporters: [new FancyReporter()],
})
