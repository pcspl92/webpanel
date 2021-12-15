const expressJwt = require('express-jwt');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
  const unprotectedPaths = ['/api/auth/login/agent', '/api/auth/login/company'];

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    expressJwt({
      secret: process.env.TOKEN_SECRET,
      algorithms: ['HS256'],
      credentialsRequired: false,
      getToken: (req) => {
        if (req.signedCookies.auth) return req.signedCookies.auth;
        return null;
      },
    }).unless({ path: unprotectedPaths })
  );
};
