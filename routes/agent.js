const express = require('express');
const guard = require('express-jwt-permissions')();

const { agentSubAgentCheck, isLoggedIn } = require('../guard');
const { getAgentActivityLogs, getAgentUnitPrice } = require('../queries/agent');

const router = express.Router();

// @route   GET api/agent/activity-logs
// @desc    Agent and Subagent activity logs fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/activity-logs',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const data = await getAgentActivityLogs(req.user.id);
    return res.status(200).json(data);
  }
);

// @route   GET api/agent/unit-price/:type/:renewal
// @desc    Agent and Subagent unit price fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/unit-price/:type/:renewal',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const [{ unitPrice }] = await getAgentUnitPrice(
      req.user.id,
      req.params.type,
      req.params.renewal,
      'agent'
    );
    return res.status(200).json(unitPrice);
  }
);

module.exports = router;
