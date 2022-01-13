const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const auth = require('../routes/auth');
const agent = require('../routes/agent');
const company = require('../routes/company');
const dept = require('../routes/department');
const tg = require('../routes/talkgroup');
const order = require('../routes/order');
const subagent = require('../routes/subagent');
const user = require('../routes/user');
const cl = require('../routes/contactlist');
const dashboard = require('../routes/dashboard');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
      credentials: true,
    })
  );
  app.use(express.static('../client/build'));
  app.use('/api/auth', auth);
  app.use('/api/agent', agent);
  app.use('/api/company', company);
  app.use('/api/dashboard', dashboard);
  app.use('/api/department', dept);
  app.use('/api/talkgroup', tg);
  app.use('/api/subagent', subagent);
  app.use('/api/order', order);
  app.use('/api/user', user);
  app.use('/api/contactlist', cl);
};
