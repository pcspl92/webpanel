const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const agentSubAgentCheck = require('../guard/agentSubAgent');
const { findCompanyByUsername, createCompany } = require('../queries/company');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   POST api/company/
// @desc    Company creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
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

module.exports = router;
