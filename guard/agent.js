module.exports = (err, req, res, next) => {
  if (err.code === 'permission_denied')
    return res.status(403).send('Agent access only');

  return next();
};
