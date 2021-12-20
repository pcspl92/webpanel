const express = require('express');
const agentSubAgentCheck = require('../guard/agentSubAgent');

const router = express.Router();

// @route   GET api/license/
// @desc    Testing route
// @access  Public
const {
createLicense

} = require('../queries/license');
router.get('/', (req, res) => {
  const user = 'hello';
  return res.status(200).json({ test: user });
});
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
module.exports = router;
