const jwt = require('jsonwebtoken');
const _ = require('lodash');

function verify(req, res, next) {
  const token = req.headers.authorization.replace('Bearer ', '').trim();

  jwt.verify(token, process.env.JWT_SECRET, null, (err, decoded) => {
    if (err) {
      res.status(403).json({error: err});
    } else {
      req.decoded = decoded;
      req.userCookies = _.map(req.decoded.cookies, (cookie) => cookie.name + '=' + cookie.value).join('; ');
      return next();
    }
  });
}

function sign(data) {
  return jwt.sign(data, process.env.JWT_SECRET);
}

module.exports = {
  verify,
  sign
};
