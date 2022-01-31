const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');
const moment = require('moment');

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
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
  createTransactionLog,
  getTransactionLogs,
  getCompanyOrderList,
  getCompanyTransactionList,
  getLicenseTypes,
} = require('../queries/order');
const {
  getAgentUnitPrice,
  deductBalance,
  getAgentBalance,
  addProfit,
  getSubAgents,
  createAgentActivityLog,
  getAgentId,
} = require('../queries/agent');

const router = express.Router();

// @route   GET api/order/agent-panel
// @desc    Agent-Subagent orders fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/agent-panel',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
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
  }
);

// @route   GET api/order/transaction/agent-panel
// @desc    Agent-Subagent transaction logs fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/transaction/agent-panel',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const transactions = await getTransactionLogs(req.user.id);
    return res.status(200).json(transactions);
  }
);

// @route   GET api/order/company-panel
// @desc    Company Panel orders view fetching route
// @access  Private(Company)
router.get(
  '/company-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const orders = await getCompanyOrderList(req.user.id, currDate);
    return res.status(200).json(orders);
  }
);

// @route   GET api/order/transaction/company-panel
// @desc    Company Panel order transaction view fetching route
// @access  Private(Company)
router.get(
  '/transaction/company-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    const transactions = await getCompanyTransactionList(req.user.id, currDate);
    return res.status(200).json(transactions);
  }
);

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

    let price = unitPrice * req.body.qty;
    await deductBalance(price, req.user.id);
    await createTransactionLog(
      'Order Created',
      price,
      balance - price,
      'DR',
      req.user.id,
      orderRes.insertId
    );
    if (req.user.permissions.includes('subagent')) {
      const [{ agentUnitPrice }] = await getAgentUnitPrice(
        req.user.id,
        req.body.license_type,
        req.body.renewal,
        'subagent'
      );
      const result = await getAgentId(req.user.id);
      price = (unitPrice - agentUnitPrice) * req.body.qty;
      await addProfit(price, result[0].agent_id);
      await createTransactionLog(
        'Order Created',
        price,
        balance - price,
        'CR',
        result[0].agent_id,
        orderRes.insertId
      );
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
    return res.status(201).send('updated');
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
    let price = unitPrice * req.body.period * licenseCount;
    await deductBalance(price, req.user.id);
    await createTransactionLog(
      'Order Renewal',
      price,
      balance - price,
      'DR',
      req.user.id,
      orderRes.insertId
    );
    if (req.user.permissions.includes('subagent')) {
      const [{ agentUnitPrice }] = await getAgentUnitPrice(
        req.user.id,
        order[0].license_type,
        req.body.renewal,
        'subagent'
      );
      const result = await getAgentId(req.user.id);
      price = (unitPrice - agentUnitPrice) * req.body.period * licenseCount;
      await addProfit(price, result[0].agent_id);
      await createTransactionLog(
        'Order Renewal',
        price,
        balance - price,
        'CR',
        result[0].agent_id,
        orderRes.insertId
      );
    }
    await createAgentActivityLog('Order Renewal', req.user.id);
    return res.status(201).send('updated');
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
    return res.status(201).send('updated');
  }
);

module.exports = router;
