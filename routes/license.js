const express = require('express');
const guard = require('express-jwt-permissions')();

const agentSubAgentCheck = require('../guard/agentSubAgent');
const {
  createLicense,findLicense
  } = require('../queries/license');
  const { route } = require('./company');
  
const router = express.Router();

// @route   GET api/license/
// @desc    License creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    await createLicense(
      req.body.license_type,
      req.body.expiry,
      req.body.trasnsationDetails,
      req.body.transactionamount,
      req.body.companyid,
      req.user.id
    );
    return res.status(201).send('created');
  }
);



router.post('/',    guard.check([['agent'], ['subagent']]),
agentSubAgentCheck,
 async (req, res) => {
 await createLicense(
    req.body.license_type,
    req.body.expiry,
    req.body.trasnsationDetails,
    req.body.transactionamount,
    req.body.companyid,
    req.body.userid,
    req.body.timestamp
  );
  return res.status(201).send('created');
});
route.get('/',    guard.check([['agent'], ['subagent']]),
agentSubAgentCheck,
 async (req, res) => {
 const licenselist = await findLicense();
  return res.status(201).send(licenselist);
});

module.exports = router;