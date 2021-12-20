const express = require('express');
const _ = require('lodash');

const {
  findAgent,
  createAgent,
  addAgentdetials,
  addPriceDetails,
  createLicense,
} = require('../queries/agent');
const { findCompany } = require('../queries/company');
const genToken = require('../utils/genToken');
const { comparePassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   GET api/auth/login/status/
// @desc    Gives the status of user whether logged-in or not
// @access  Public(all)
router.get('/status', (req, res) => {
  if (req.user) return res.status(200).json(req.user);
  return res.status(200).send(false);
});

// @route   POST api/auth/login/agent
// @desc    Agent and Subagent login route
// @access  Public(all)
router.post('/login/agent', async (req, res) => {
  const user = await findAgent(req.body.username);

  if (!user.length)
    return res
      .status(400)
      .json({ username: 'No agent with given username exists' });

  if (user[0].password !== req.body.password)
    return res.status(400).json({ password: 'Wrong credentials' });

  res.cookie(
    'auth',
    genToken({
      ..._.omit(user[0], ['password']),
      permissions: [user[0].agent_type],
    }),
    {
      signed: true,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    }
  );

  return res.status(200).send('logged in');
});

// @route   POST api/auth/login/company
// @desc    Company login route
// @access  Public(all)
router.post('/login/company', async (req, res) => {
  const company = await findCompany(req.body.username);

  if (!company.length)
    return res
      .status(400)
      .json({ username: 'No company with given username exists' });

  if (!(await comparePassword(req.body.password, company[0].password)))
    return res.status(400).json({ password: 'Wrong credentials' });

  res.cookie(
    'auth',
    genToken({ ..._.omit(company[0], ['password']), permissions: ['company'] }),
    {
      signed: true,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    }
  );

  return res.status(200).send('logged in');
});

// @route   POST api/auth/logout
// @desc    Logout route
// @access  Public(all)
router.post('/logout', (req, res) => {
  res.cookie('auth', '', {
    maxAge: -1,
    path: '/',
  });
  return res.status(200).send('logged out');
});



module.exports = router;
