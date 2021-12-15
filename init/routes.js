const express = require('express');
const morgan = require('morgan');
const auth = require('../routes/auth');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use('/api/auth', auth);
  app.use('*', (req, res) => res.status(400).send('Invalid Route'));
};
