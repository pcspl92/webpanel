const express = require('express');
const guard = require('express-jwt-permissions')();

const agentSubAgentCheck = require('../guard/agentSubAgent');

const router = express.Router();

// @route   GET api/user/
// @desc    User view route
// @access  Private(Agent|Subagent)
router.get(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const user = 'test';
    return res.status(200).json(user);
  }
);

module.exports = router;
