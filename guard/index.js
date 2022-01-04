const agentCheck = (err, req, res, next) => {
  if (err.code === 'permission_denied')
    return res.status(403).send('Agent access only');

  return next();
};

const agentSubAgentCheck = (err, req, res, next) => {
  if (err.code === 'permission_denied')
    return res.status(403).send('Agent or Subagent access only');

  return next();
};

const companyCheck = (err, req, res, next) => {
  if (err.code === 'permission_denied')
    return res.status(403).send('Company access only');

  return next();
};

module.exports = { agentCheck, agentSubAgentCheck, companyCheck };
