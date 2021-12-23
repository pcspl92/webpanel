const express = require('express');
const morgan = require('morgan');

const auth = require('../routes/auth');
const company = require('../routes/company');
const dept = require('../routes/department');
const tg = require('../routes/talkgroup');
const license = require('../routes/license');
const subagent = require('../routes/subagent');
const user = require('../routes/user');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use('/api/auth', auth);
  app.use('/api/company', company);
  app.use('/api/department', dept);
  app.use('/api/talkgroup', tg);
  app.use('/api/subagent', subagent);
  app.use('/api/license', license);
  app.use('/api/user', user);
  app.use('*', (req, res) => res.status(400).send('Invalid Route'));
};
