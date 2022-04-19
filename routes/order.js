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
  companyStatus,
  createTransactionLog,
  getTransactionLogs,
  getCompanyOrderList,
  getCompanyTransactionList,
  getOrderList,
  getUsers,
  getFeatures,
  getOrderData,
  getUnitPrices,
  getLicensesForOrder,
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
const { getCompanies } = require('../queries/company');

const router = express.Router();

// @route   GET api/order/
// @desc    Orders fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    let agents = [req.user.id];
    if (req.user.permissions.includes('agent')) {
      const result = await getSubAgents(req.user.id);
      agents = result.reduce((acc, sub) => [...acc, sub.id], [req.user.id]);
    }

    const list = await getOrderList(agents);
    return res.status(200).json(list);
  }
);

// @route   GET api/order/agent-panel
// @desc    Agent-Subagent orders fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/agent-panel',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    let agents = [req.user.id];
    if (req.user.permissions.includes('agent')) {
      const result = await getSubAgents(req.user.id);
      agents = result.reduce((acc, sub) => [...acc, sub.id], [req.user.id]);
    }

    const subAgentOrders = await getOrders(agents, currDate);
    return res.status(200).json(subAgentOrders);
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

// @route   GET api/order/:orderId/:type
// @desc    Order update page data fetching route
// @access  Private(Agent|Subagent)
router.get(
  '/:orderId/:type',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const order = await findOrder(req.params.orderId);
    if (!order.length)
      return res
        .status(404)
        .json({ order: "Order with given id doesn't exist." });

    const getUpdateFormData = async () => {
      const users = await getUsers(req.params.orderId);
      const features = await getFeatures(req.params.orderId);
      return { users, features: features[0] };
    };

    const getRenewFormData = async () => {
      const users = await getUsers(req.params.orderId);
      const [{ expDate, type }] = await getOrderData(req.params.orderId);
      const [unitPrices] = await getUnitPrices(type, req.user.id);
      return { users, expDate, unitPrices };
    };

    const getTransferFormData = async () => {
      const [{ count }] = await getLicenseCount(req.params.orderId);
      let subagents = [req.user.id];
      if (req.user.permissions.includes('agent')) {
        const result = await getSubAgents(req.user.id);
        subagents = result.reduce(
          (acc, sub) => [...acc, sub.id],
          [req.user.id]
        );
      }

      const companies = await getCompanies(subagents);
      return { available: count, companies };
    };

    let data;
    switch (req.params.type) {
      case 'update':
        data = await getUpdateFormData();
        break;
      case 'transfer':
        data = await getTransferFormData();
        break;
      case 'renew':
        data = await getRenewFormData();
        break;
      default:
        return res
          .status(400)
          .json({ type: 'Only update, transfer and renew types are allowed' });
    }

    return res.status(200).json(data);
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
    // console.log(req.body)
    const data = await companyStatus(req.body.company_id)
    if(data==="active"){
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
      // console.log("Hello")
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
      console.log(orderRes)
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
      return res.status(201).send({ message: 'License has been created' });
    }
    else{
      return res.status(201).send({message:"Selected Company is paused"})
    }
    
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

    const result = await getLicensesForOrder(
      req.params.orderId,
      req.body.user_ids
    );
    const licenseIds = result.reduce((acc, val) => [...acc, val.id], []);
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
      moment(`${order[0].license_expiry}`).format('YYYY-MM-DD HH:mm:ss'),
      order[0].company_id,
      featureRes.insertId,
      order[0].renewal,
      order[0].agent_id
    );
    await updateOrderId(licenseIds, orderRes.insertId);
    await createAgentActivityLog('Order Features Modify', req.user.id);
    return res.status(201).send({ message: 'Order has been updated' });
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

    const result = await getLicensesForOrder(
      req.params.orderId,
      req.body.user_ids
    );
    const licenseIds = result.reduce((acc, val) => [...acc, val.id], []);
    const [{ unitPrice }] = await getAgentUnitPrice(
      req.user.id,
      order[0].license_type,
      req.body.renewal
    );
    const [{ balance }] = await getAgentBalance(req.user.id);

    if (balance < unitPrice * req.body.period * licenseIds.length)
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
    await updateOrderId(licenseIds, orderRes.insertId);
    let price = unitPrice * req.body.period * licenseIds.length;
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
      const [{ agentId }] = await getAgentId(req.user.id);
      price =
        (unitPrice - agentUnitPrice) * req.body.period * licenseIds.length;
      await addProfit(price, agentId);
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
    return res.status(201).send({ message: 'Order has been renewed' });
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
      moment(`${order[0].license_expiry}`).format('YYYY-MM-DD HH:mm:ss'),
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
    return res.status(201).send({ message: 'Order Transfer done' });
  }
);

module.exports = router;
