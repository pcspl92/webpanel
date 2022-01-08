const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const {
  findCompanyByUsername,
  createCompany,
  findCompanies,
  updateCompany,
  getCompanyActivityLogs,
} = require('../queries/company');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   GET api/company/activity-logs
// @desc    Company activity logs fetching route
// @access  Private(Company)
router.get(
  '/activity-logs',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const data = await getCompanyActivityLogs(req.user.id);
    return res.status(200).json(data);
  }
);

// @route   POST api/company/
// @desc    Company creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanyByUsername(req.body.username);
    if (company.length)
      return res
        .status(400)
        .json({ username: 'Company with given username already exists' });

    const password = await hashPassword(req.body.password);
    const data = {
      ..._.pick(req.body, ['username', 'display_name', 'contact_number']),
      password,
      agentId: req.user.id,
    };

    await createCompany(data);
    return res.status(201).send('created');
  }
);
router.get(
  '/',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanies();
    if (!company.length)
      return res.status(400).json({ username: 'No company exists' });

    const companylist = await findCompanies();
    return res.status(201).send(companylist);
  }
);
router.put(
  '/',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    await updateCompany(
      req.body.newpassword,
      req.body.newcompanyname,
      req.body.newcontactnumber,
      req.body.newsubagent
    );
    return res.status(201).send('Company details updated');
  }
);

module.exports = router;
