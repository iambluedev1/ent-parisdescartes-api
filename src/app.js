const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('./logger');
const morgan = require('morgan');
const dotenv = require('dotenv');
const pjson = require('../package.json');
dotenv.config();

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const formats = ":remote-addr [:date[iso]] [method=':method', url=':url', status=':status', user-agent=':user-agent', response-time=':response-time']"; // eslint-disable-line

morgan.token('remote-addr', (req) => {
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  } else {
    return req.ip || (req.connection && req.connection.remoteAddress) || undefined;
  }
});

app.use(morgan(formats, {
  stream: {
    write: (text) => {
      logger.info(text.trimRight());
    }
  }
}));

app.use((req, res, next) => {
  res.oldJson = res.json;
  res.json = (object) => {
    return res.oldJson({
      return: object,
      api: {
        request: {
          path: req.url,
          body: req.body || req.params || req.query
        },
        response: {
          code: res.statusCode,
        },
        name: pjson.name,
        version: pjson.version,
        github: 'https://github.com/iambluedev1/ent-parisdescartes-api'
      }
    });
  };
  next();
});

app.use(require('./api/auth'));
app.use(require('./api/user'));
app.use(require('./api/course'));

app.get('*', (req, res) => {
  res.status(404).json({
    error: '404 Not Found'
  });
});

module.exports = app;
