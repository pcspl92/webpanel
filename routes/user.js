const express = require('express');
const guard = require('express-jwt-permissions')();

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const { getSubAgents } = require('../queries/agent');
const { getUsersAgentPanel } = require('../queries/user');

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
  '/agent-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = `Helllo User`;
    return res.status(200).json(user);
  }
);

module.exports = router;
