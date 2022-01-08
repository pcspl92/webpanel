const express = require('express');
const guard = require('express-jwt-permissions')();

const { agentSubAgentCheck, isLoggedIn } = require('../guard');
const { getAgentActivityLogs } = require('../queries/agent');

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

module.exports = router;
