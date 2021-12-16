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

const router = express.Router();

// @route   GET api/auth/login/status
// @desc    Gives the status of user whether logged-in or not
// @access  Public
router.get('/status', (req, res) => {
  if (req.user) return res.status(200).json(req.user);
  return res.status(200).send(false);
});

// @route   POST api/auth/login/agent
// @desc    Agent and Subagent login route
// @access  Public
router.post('/login/agent', async (req, res) => {
  const user = await findAgent(req.body.username);

  if (!user.length)
    return res
      .status(400)
      .json({ username: 'No agent with given username exists' });

  if (user[0].password !== req.body.password)
    return res.status(400).json({ password: 'Wrong credentials' });

  res.cookie('auth', genToken(_.omit(user[0], ['password'])), {
    signed: true,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
  });

  return res.json({ logged: 'in' });
});

// @route   POST api/auth/login/company
// @desc    Company login route
// @access  Public
router.post('/login/company', async (req, res) => {
  const company = await findCompany(req.body.username);

  if (!company.length)
    return res
      .status(400)
      .json({ username: 'No company with given username exists' });

  if (company[0].password !== req.body.password)
    return res.status(400).json({ password: 'Wrong credentials' });

  res.cookie('auth', genToken(_.omit(company[0], ['password'])), {
    signed: true,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
  });

  return res.json({ logged: 'in' });
});

// @route   POST api/auth/logout
// @desc    Logout route
// @access  Public
router.post('/logout', (req, res) => {
  res.cookie('auth', '', {
    maxAge: -1,
    path: '/',
  });
  return res.json({ logged: 'out' });
});

router.post('/createagent', async (req, res) => {
  const newAgent = await createAgent(
    req.body.username,
    req.body.password,
    req.body.display_name,
    req.body.agent_type,
    req.body.agent_id
  );
  const adddetials = await addAgentdetials(
    req.body.balance,
    req.body.contact_number,
    req.body.agent_id,
    req.body.timestamp
  );
  const addPrice = await addPriceDetails(
    req.body.license_type,
    req.body.monthly,
    req.body.quarterly,
    req.body.half_yearly,
    req.body.yearly,
    req.body.one_time,
    req.body.agent_id,
    req.body.timestamp
  );
});
router.post('/createlicense', async (req, res) => {
  const newLicense = await createLicense(
    req.body.license_type,
    req.body.expiry,
    req.body.trasnsationDetails,
    req.body.transactionamount,
    req.body.companyid,
    req.body.userid,
    req.body.timestamp
  );
});
module.exports = router;
