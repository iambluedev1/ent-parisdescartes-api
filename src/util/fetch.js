const nodeFetch = require('node-fetch');
const logger = require('../logger');

function fetch(url, req) {
  logger.debug('fetching ' + url);
  return nodeFetch(url, {
    headers: {
      cookie: req.userCookies
    }
  })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.text();
    })
    .then(text => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return Promise.reject({body: text, type: 'unparsable', error: e});
      }
    })
    .then(json => {
      if (json.success === false) {
        return Promise.reject({
          body: json.flashMessages === undefined ? json.message : json.flashMessages.error,
          type: 'forbidden'
        });
      }
      return json;
    });
}

function error(e, req, res) {
  if (e.status === undefined && e.type === 'unparsable') {
    logger.error('Unable to parse fetched data');
    res.status(403).json({
      error: {
        name: 'EntParseError',
        message: 'Unable to parse fetched data'
      }
    });
  } else if (e.status === undefined && e.type === 'forbidden') {
    res.status(403).json({
      error: {
        name: 'EntForbiddenError',
        message: e.body
      }
    });
  } else if (e.status === 404) {
    res.status(403).json({
      error: {
        name: 'EntForbiddenError',
        message: 'Token no more usable'
      }
    });
  } else {
    logger.error(e);
    res.status(500).json({
      error: {
        name: 'EntServerError',
        message: 'Error'
      }
    });
  }
}

module.exports = {
  fetch, error
};
