const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  exitOnError: false,
  level: process.env.LOGGER_LEVEL || 'debug',
  transports: [
    new (transports.Console)({
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new (transports.File)({filename: 'logs/app.log'})
  ]
});

module.exports = logger;
