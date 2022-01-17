const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { agentSubAgentCheck, isLoggedIn } = require('../guard');
const getExpiryDate = require('../utils/licenseExpiryDate');
const {
  getOrders,
  findOrder,
  createFeatures,
  createOrder,
  createLicense,
  updateOrderId,
  getLicenseIds,
  getLicenseCount,
} = require('../queries/order');
const {
  getAgentUnitPrice,
  deductBalance,
  getAgentBalance,
  addProfit,
  getSubAgents,
  createAgentActivityLog,
} = require('../queries/agent');

const router = express.Router();

// @route   GET api/order/
// @desc    Agent-Subagent orders fetching route
// @access  Private(Agent|Subagent)
router.get('/', isLoggedIn, async (req, res) => {
  if (req.user.permissions.includes('agent')) {
    const result = await getSubAgents(req.user.id);
    const subagents = result.reduce(
      (acc, sub) => [...acc, sub.id],
      [req.user.id]
    );
    const agentOrders = await getOrders(subagents);
    return res.status(200).json(agentOrders);
  }

  const subAgentOrders = await getOrders([req.user.id]);
  return res.status(200).json(subAgentOrders);
});

// @route   GET api/order/:orderId/count
// @desc    Available license count providing route
// @access  Private(Agent|Subagent)
router.get('/:orderId/count', isLoggedIn, async (req, res) => {
  const order = await findOrder(req.params.orderId);
  if (!order.length)
    return res
      .status(404)
      .json({ order: "Order with given id doesn't exist." });

  const licenseCount = await getLicenseCount(req.params.orderId);
  return res.status(200).json({ licenseCount });
});

// @route   POST api/order/
// @desc    Order creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
  isLoggedIn,
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

    const expiryDate = getExpiryDate(req.body.renewal, 1);
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
      req.body.renewal,
      req.user.id
    );
    await createLicense(orderRes.insertId, req.body.qty);

    await deductBalance(unitPrice * req.body.qty, req.user.id);
    if (req.user.permissions.includes('subagent')) {
      const [{ agentUnitPrice }] = await getAgentUnitPrice(
        req.user.id,
        req.body.license_type,
        req.body.renewal,
        'subagent'
      );
      await addProfit((unitPrice - agentUnitPrice) * req.body.qty, req.user.id);
    }
    await createAgentActivityLog('Order Create', req.user.id);
    return res.status(201).send('created');
  }
);

// @route   PUT api/order/:orderId/features
// @desc    Order update features route
// @access  Private(Agent|Subagent)
router.put(
  '/:orderId/features',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const order = await findOrder(req.params.orderId);
    if (!order.length)
      return res
        .status(404)
        .json({ order: "Order with given id doesn't exist." });

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
      order[0].license_type,
      order[0].license_expiry,
      order[0].company_id,
      featureRes.insertId,
      order[0].renewal,
      order[0].agent_id
    );
    await updateOrderId(
      req.body.license_ids,
      orderRes.insertId,
      req.params.orderId,
      req.body.all
    );
    await createAgentActivityLog('Order Features Modify', req.user.id);
    return res.status(201).send('Updated');
  }
);

// @route   PUT api/order/:orderId/renewal
// @desc    Order renewal route
// @access  Private(Agent|Subagent)
router.put(
  '/:orderId/renewal',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const order = await findOrder(req.params.orderId);
    if (!order.length)
      return res
        .status(404)
        .json({ order: "Order with given id doesn't exist." });

    const [{ unitPrice }] = await getAgentUnitPrice(
      req.user.id,
      order[0].license_type,
      req.body.renewal
    );
    const getAllLicenses = await getLicenseCount(req.params.orderId);
    const licenseCount = req.body.all
      ? getAllLicenses[0].count
      : req.body.license_ids.length;
    const [{ balance }] = await getAgentBalance(req.user.id);

    if (balance < unitPrice * req.body.period * licenseCount)
      return res.status(400).json({
        balance: `Insufficient balance`,
      });

    const expiryDate = getExpiryDate(
      req.body.renewal,
      req.body.period,
      order[0].license_expiry
    );
    const orderRes = await createOrder(
      order[0].license_type,
      expiryDate,
      order[0].company_id,
      order[0].feature_id,
      req.body.renewal,
      order[0].agent_id
    );
    await updateOrderId(
      req.body.license_ids,
      orderRes.insertId,
      req.params.orderId,
      req.body.all
    );

    await deductBalance(
      unitPrice * req.body.period * licenseCount,
      req.user.id
    );
    if (req.user.permissions.includes('subagent')) {
      const [{ agentUnitPrice }] = await getAgentUnitPrice(
        req.user.id,
        order[0].license_type,
        req.body.renewal,
        'subagent'
      );
      await addProfit(
        (unitPrice - agentUnitPrice) * req.body.period * licenseCount,
        req.user.id
      );
    }
    await createAgentActivityLog('Order Renewal', req.user.id);
    return res.status(201).send('Updated');
  }
);

// @route   PUT api/order/:orderId/transfer
// @desc    Order transfer route
// @access  Private(Agent|Subagent)
router.put(
  '/:orderId/transfer',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const order = await findOrder(req.params.orderId);
    if (!order.length)
      return res
        .status(404)
        .json({ order: "Order with given id doesn't exist." });

    const [{ count }] = await getLicenseCount(req.params.orderId);
    console.log('licenseCount', count);
    if (req.body.qty > count)
      return res.status(400).json({
        licenseCount: `You can't transfer more than ${count} licenses.`,
      });

    const orderRes = await createOrder(
      order[0].license_type,
      order[0].license_expiry,
      req.body.company_id,
      order[0].feature_id,
      order[0].renewal,
      order[0].agent_id
    );
    const result = await getLicenseIds(req.params.orderId, req.body.qty);
    const licenseIds = result.reduce(
      (acc, license) => [...acc, license.id],
      []
    );
    await updateOrderId(licenseIds, orderRes.insertId, req.params.orderId);
    await createAgentActivityLog('Order Transfer', req.user.id);
    return res.status(201).send('Updated');
  }
);

module.exports = router;
