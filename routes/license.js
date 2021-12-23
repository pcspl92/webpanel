const express = require('express');
const guard = require('express-jwt-permissions')();

const agentSubAgentCheck = require('../guard/agentSubAgent');
const { createLicense } = require('../queries/license');

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

<<<<<<< HEAD
const {
createLicense,findLicense
} = require('../queries/license');
const { route } = require('./company');


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
=======
>>>>>>> 7de2e131fa1264f91610f4fd4f8c44372ef91252
module.exports = router;
