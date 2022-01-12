const express = require('express');
const _ = require('lodash');
const guard = require('express-jwt-permissions')();
const axios = require('axios');

const getIP = require('../utils/getIPAddress');
const genToken = require('../utils/genToken');
const { comparePassword, hashPassword } = require('../utils/bcrypt');
const {
  findCompany,
  updateCompanyPassword,
  createCompanyAuthLog,
  getCompanyLoginLogs,
} = require('../queries/company');
const {
  findAgent,
  updateAgentPassword,
  getAgentBalance,
  createAgentAuthLog,
  getAgentLoginLogs,
} = require('../queries/agent');
const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');

const router = express.Router();

// @route   GET api/auth/status/
// @desc    Gives the status of user whether logged-in or not
// @access  Public(all)
router.get('/status', async (req, res) => {
  if (req.user) {
    if (
      req.user.permissions[0] === 'agent' ||
      req.user.permissions[0] === 'subagent'
    ) {
      const [{ balance }] = await getAgentBalance(req.user.id);
      return res.status(200).json({
        ..._.omit(req.user, ['iat', 'permissions']),
        type: req.user.permissions[0],
        balance,
      });
    }

    return res.status(200).json({
      ..._.omit(req.user, ['iat', 'permissions']),
      type: req.user.permissions[0],
    });
  }

  return res.status(200).send(false);
});

// @route   GET api/auth/logs/agent
// @desc    Agent and Subagent login logs fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/logs/agent',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const data = await getAgentLoginLogs(req.user.id);
    return res.status(200).json(data);
  }
);

// @route   GET api/auth/logs/company
// @desc    Company login logs fetching route
// @access  Private(Company)
router.get(
  '/logs/company',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const data = await getCompanyLoginLogs(req.user.id);
    return res.status(200).json(data);
  }
);

// @route   PUT api/auth/password/agent
// @desc    Agent and Subagent password change route
// @access  Private(Agent|Subagent)
router.put(
  '/password/agent',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const password = await hashPassword(req.body.password);
    await updateAgentPassword(password, req.user.id);
    return res.status(200).send('updated');
  }
);

// @route   PUT api/auth/password/company
// @desc    Company password change route
// @access  Private(Company)
router.put(
  '/password/company',
  isLoggedIn,
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

  // const ip = await getIP();
  // await createAgentAuthLog('Logged In', ip, user[0].id);

  res.cookie(
    'auth',
    genToken({
      ..._.omit(user[0], ['password', 'agent_type']),
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

  // const ip = await getIP();
  // await createCompanyAuthLog('Logged In', ip, company[0].id);

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
router.post('/logout', isLoggedIn, async (req, res) => {
  // const ip = await getIP();
  // if (
  //   req.user.permissions[0] === 'agent' ||
  //   req.user.permissions[0] === 'subagent'
  // )
  //   await createAgentAuthLog('Logged Out', ip, req.user.id);
  // else await createCompanyAuthLog('Logged Out', ip, req.user.id);
  res.cookie('auth', '', {
    maxAge: -1,
    path: '/',
  });
  return res.status(200).send('logged out');
});

// @route   POST api/auth/verify-captcha
// @desc    Captcha verify route
// @access  Public(all)
router.post('/verify-captcha', async (req, res) => {
  const { data } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${req.body.token}`
  );

  if (!data.success)
    return res.status(400).send('Incorrect Captcha Token Used');
  return res.status(200).send('Verified');
});

module.exports = router;
