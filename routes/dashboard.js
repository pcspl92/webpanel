const express = require('express');
const guard = require('express-jwt-permissions')();
const moment = require('moment');
const _ = require('lodash');

const { companyCheck, agentSubAgentCheck, isLoggedIn } = require('../guard');
const {
  getSubAgents,
  getTotalCompanyCount,
  getDashboardData,
} = require('../queries/agent');
const {
  getDashboardData: getDashboardDataCompany,
} = require('../queries/company');

const router = express.Router();

// @route   GET api/dashboard/agent
// @desc    Agent dashboard data fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/agent',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const subagents = await getSubAgents(req.user.id);
    const ids = subagents.reduce((acc, val) => [...acc, val.id], [req.user.id]);
    const companyCount = await getTotalCompanyCount(ids);
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const result = await getDashboardData(ids, currDate);

    const accounts = result.reduce(
      (acc, val) => ({
        ...acc,
        [val.license_type]: _.omit(val, 'license_type'),
      }),
      {}
    );

    const data = {
      data: accounts,
      total_companies: companyCount[0].total_companies,
      total_subagents: subagents.length,
    };

    return res.status(200).json(data);
  }
);

// @route   GET api/dashboard/company
// @desc    Company dashboard data fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/company',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const result = await getDashboardDataCompany(req.user.id, currDate);
    const accounts = result.reduce(
      (acc, val) => ({
        ...acc,
        [val.license_type]: _.omit(val, 'license_type'),
      }),
      {}
    );

    const data = {
      data: accounts,
    };

    return res.status(200).json(data);
  }
);

module.exports = router;
