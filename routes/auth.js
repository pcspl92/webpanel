const express = require('express');
const _ = require('lodash');
const guard = require('express-jwt-permissions')();

const genToken = require('../utils/genToken');
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const { findCompany, updateCompanyPassword } = require('../queries/company');
const { findAgent, updateAgentPassword } = require('../queries/agent');
const { agentSubAgentCheck, companyCheck } = require('../guard');

const router = express.Router();

// @route   GET api/auth/login/status/
// @desc    Gives the status of user whether logged-in or not
// @access  Public(all)
router.get('/status', (req, res) => {
  if (req.user) return res.status(200).json(req.user);
  return res.status(200).send(false);
});

// @route   PUT api/auth/changepassword/agent
// @desc    Agent and Subagent password change route
// @access  Private(Agent|Subagent)
router.put(
  '/changepassword/agent',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const password = await hashPassword(req.body.password);
    await updateAgentPassword(password, req.user.id);
    return res.status(200).send('updated');
  }
);

// @route   PUT api/auth/changepassword/company
// @desc    Company password change route
// @access  Private(Company)
router.put(
  '/changepassword/company',
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const password = await hashPassword(req.body.password);
    await updateCompanyPassword(password, req.user.id);
    return res.status(200).send('updated');
  }
);

// @route   POST api/auth/login/agent
// @desc    Agent and Subagent login route
// @access  Public(all)
router.post('/login/agent', async (req, res) => {
  const user = await findAgent(req.body.username);

  if (!user.length)
    return res.status(400).json({ auth: 'Wrong credential combination' });

  if (!(await comparePassword(req.body.password, user[0].password)))
    return res.status(400).json({ auth: 'Wrong credential combination' });

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
    return res.status(400).json({ auth: 'Wrong credential combination' });

  if (!(await comparePassword(req.body.password, company[0].password)))
    return res.status(400).json({ auth: 'Wrong credential combination' });

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
// @access  Private(Agent|Subagent|Company)
router.post('/logout', (req, res) => {
  res.cookie('auth', '', {
    maxAge: -1,
    path: '/',
  });
  return res.status(200).send('logged out');
});

module.exports = router;
