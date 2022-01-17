const express = require('express');
const guard = require('express-jwt-permissions')();

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const { getSubAgents } = require('../queries/agent');
const { getUsersAgentPanel, getPttUsers } = require('../queries/user');

const router = express.Router();

// @route   GET api/user/agent-panel
// @desc    User view route for agent panel
// @access  Private(Agent|Subagent)
router.get(
  '/agent-panel',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const result = await getSubAgents(req.user.id);
    const agentIds = result.reduce(
      (acc, sub) => [...acc, sub.id],
      [req.user.id]
    );
    const userData = await getUsersAgentPanel(agentIds);

    return res.status(200).json(userData);
  }
);

// @route   GET api/user/company-panel
// @desc    User view route for company panel
// @access  Private(Company)
router.get(
  '/company-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = `Helllo User`;
    return res.status(200).json(user);
  }
);

// @route   GET api/user/ptt
// @desc    PTT user fetching route
// @access  Private(Company)
router.get(
  '/ptt',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    // working
    const users = await getPttUsers(req.user.id);
    return res.status(200).json(users);
  }
);

module.exports = router;
