const jwt = require('jsonwebtoken');

module.exports = function genToken(payload) {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: 'HS256',
  });
  return token;
};
