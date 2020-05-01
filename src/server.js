const errorHandler = require('errorhandler');
const app = require('./app');
const logger = require('./logger');
const browser = require('./browser');

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

browser
  .create()
  .then(() => app.listen(app.get('port'), () => {
    logger.info('App is running at http://localhost:' + app.get('port') + ' in ' + app.get('env') + 's mode');
    logger.info('Press CTRL-C to stop\n');
  }))
  .catch((e) => {
    logger.error(e);
  });

