const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const agentSubAgentCheck = require('../guard/agentSubAgent');
const getExpiryDate = require('../utils/licenseExpiryDate');
const {
  findLicense,
  createFeatures,
  createOrder,
  createLicense,
} = require('../queries/license');
const {
  getAgentUnitPrice,
  deductBalance,
  getAgentBalance,
} = require('../queries/agent');

const router = express.Router();

// @route   POST api/license/
// @desc    License creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const [{ unitPrice }] = await getAgentUnitPrice(
      req.user.id,
      req.body.license_type,
      req.body.renewal
    );
    const [{ balance }] = await getAgentBalance(req.user.id);
    if (balance < unitPrice * req.body.qty)
      return res.status(400).json({
        balance: `You can create atmost ${Math.floor(
          balance / unitPrice
        )} licenses.`,
      });

    const expiryDate = getExpiryDate(req.body.renewal);
    const featureRes = await createFeatures(
      _.pick(req.body.features, [
        'grp_call',
        'enc',
        'priv_call',
        'live_gps',
        'geo_fence',
        'chat',
      ])
    );
    const orderRes = await createOrder(
      req.body.license_type,
      expiryDate,
      req.body.company_id,
      featureRes.insertId,
      req.user.id
    );
    await createLicense(orderRes.insertId, req.body.qty);

    await deductBalance(unitPrice * req.body.qty, req.user.id);
    return res.status(201).send('created');
  }
);

router.get(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const licenselist = await findLicense();
    return res.status(201).send(licenselist);
  }
);

module.exports = router;
