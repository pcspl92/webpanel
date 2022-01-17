const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const {
  findCompanyByUsername,
  getCompanies,
  createCompany,
  updateCompany,
  getCompanyActivityLogs,
  getCompanyViewData,
  findCompanyById,
  getDepartmentCount,
  deleteCompany,
} = require('../queries/company');
const {
  getAgentId,
  getSubAgents,
  createAgentActivityLog,
} = require('../queries/agent');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   GET api/company/
// @desc    Company list fetching route
// @access  Private(Agent|SubAgent)
router.get(
  '/',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const companies = await getCompanies(req.user.id);
    return res.status(201).json(companies);
  }
);

// @route   GET api/company/view
// @desc    Company view page data fetching route
// @access  Private(Agent|SubAgent)
router.get(
  '/view',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    let subagents = [req.user.id];
    if (req.user.permissions[0] === 'agent') {
      const result = await getSubAgents(req.user.id);
      subagents = result.reduce((acc, sub) => [...acc, sub.id], [req.user.id]);
    }

    const companies = await getCompanyViewData(subagents);
    return res.status(200).json(companies);
  }
);

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
    await createAgentActivityLog('Company Create', req.user.id);
    return res.status(201).send('created');
  }
);

// @route   PUT api/company/:id
// @desc    Company updation route
// @access  Private(Agent|Subagent)
router.put(
  '/:id',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanyById(req.params.id);
    if (!company.length)
      return res
        .status(404)
        .json({ company: 'Company with given id is not registered' });

    const password = await hashPassword(req.body.password);
    let agentId = req.body.agent_id;
    if (req.user.permissions[0] === 'subagent' && req.relieve)
      agentId = await getAgentId(req.user.id);

    await updateCompany(
      req.params.id,
      password,
      req.body.display_name,
      req.body.contact_number,
      agentId
    );
    await createAgentActivityLog('Company Modify', req.user.id);
    return res.status(200).send('updated');
  }
);

// @route   DELETE api/company/:id
// @desc    Company deletion route
// @access  Private(Agent|Subagent)
router.delete(
  '/:id',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanyById(req.params.id);
    if (!company.length)
      return res
        .status(404)
        .json({ company: 'Company with given id is not registered' });

    const [{ count }] = await getDepartmentCount(req.params.id);
    if (count)
      return res.status(400).json({
        departments: `Company has ${count} departments, delete them first.`,
      });

    await deleteCompany(req.params.id);
    await createAgentActivityLog('Company Delete', req.user.id);
    return res.status(200).send('deleted');
  }
);

module.exports = router;
