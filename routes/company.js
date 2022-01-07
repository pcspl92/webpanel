const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { companyCheck, agentSubAgentCheck, isLoggedIn } = require('../guard');
const {
  findCompanyByUsername,
  createCompany,
  findCompanies,
  updateCompany,
  fetchloglist,
  fetchActivityList,
} = require('../queries/company');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

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
      ..._.pick(req.body, ['username', 'displayName', 'contactNumber']),
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

router.post(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const loglist = await fetchloglist(req.body.companyid);

    return res.status(201).send(loglist);
  }
);
router.post(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const activitylist = await fetchActivityList(req.body.companyid);

    return res.status(201).send(activitylist);
  }
);
module.exports = router;
