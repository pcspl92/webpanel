const query = require('../utils/queryTemplate');

const getOrders = (subAgents, currDate) => {
  const sql = `SELECT o.id AS order_id, o.timestamp AS order_date, license_type, license_expiry AS expiry_date, renewal AS renewal_type,
               a.display_name AS agent_name, c.display_name AS company_name,
               f.grp_call, f.enc, f.priv_call, f.live_gps, f.geo_fence, f.chat, 
               COUNT(case when o.license_expiry > '${currDate}' then o.id else null end) - COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS available, 
               COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS active
               FROM orders o
               JOIN agents a ON o.agent_id = a.id
               JOIN features f ON o.feature_id = f.id
               JOIN companies c ON o.company_id = c.id
               JOIN licenses l ON l.order_id = o.id
               WHERE o.agent_id IN (${subAgents})
               GROUP BY o.id;`;
  return query(sql);
};

const createFeatures = ({
  grp_call: grpCall,
  enc,
  priv_call: privCall,
  live_gps: liveGps,
  geo_fence: geoFence,
  chat,
}) => {
  const sql = `INSERT INTO features (grp_call, enc, priv_call, live_gps, geo_fence, chat) 
               VALUES (${grpCall}, ${enc}, ${privCall}, ${liveGps}, ${geoFence}, ${chat});`;
  return query(sql);
};

const createOrder = (
  licenseType,
  licenseExpiry,
  companyId,
  featureId,
  renewal,
  agentId
) => {
  const sql = `INSERT INTO orders (license_type, license_expiry, renewal, company_id, feature_id, agent_id) 
               VALUES ("${licenseType}", "${licenseExpiry}", "${renewal}", ${companyId}, ${featureId}, ${agentId});`;
  return query(sql);
};

const createLicense = (orderId, qty) => {
  const sql = Array(qty)
    .fill(`(${orderId})`)
    .reduce((acc, val, index) => {
      if (index === qty - 1) return `${acc} ${val};`;
      return `${acc} ${val},`;
    }, `INSERT INTO licenses (order_id) VALUES`);
  return query(sql);
};

const findOrder = (orderId) => {
  const sql = ` SELECT * FROM orders WHERE id=${orderId}`;
  return query(sql);
};

const updateOrderId = (licenseIds, newOrderId) => {
  const sql = `UPDATE licenses SET order_id=${newOrderId} WHERE id IN (${licenseIds})`;
  return query(sql);
};

const getLicenseIds = (oldOrderId, qty) => {
  const sql = `SELECT id FROM licenses WHERE order_id = ${oldOrderId} LIMIT 0, ${qty};`;
  return query(sql);
};

const getLicenseCount = (orderId) => {
  const sql = `SELECT COUNT(id) AS count FROM licenses WHERE order_id=${orderId};`;
  return query(sql);
};

const createTransactionLog = (
  details,
  amount,
  balance,
  type,
  agentId,
  orderId
) => {
  const sql = `INSERT INTO transactions (details, trnc_amount, balance_left, type, agent_id, order_id) 
               VALUES ('${details}', ${amount}, ${balance}, '${type}', ${agentId}, ${orderId});`;
  return query(sql);
};

const getTransactionLogs = (agentId) => {
  const sql = `SELECT id, timestamp AS date, trnc_amount AS transaction_amount, type AS transaction_type,
               balance_left AS balance, details AS transaction_details FROM transactions 
               WHERE agent_id=${agentId};`;
  return query(sql);
};

const getCompanyOrderList = (companyId, currDate) => {
  const sql = `SELECT o.id, o.license_type AS account_type, o.license_expiry AS license_renewal_date,
               f.grp_call, f.enc, f.priv_call, f.live_gps, f.geo_fence, f.chat,
               COUNT(case when o.license_expiry > '${currDate}' then o.id else null end) - COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS available, 
               COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS active,
               IF(o.license_expiry > '${currDate}', "Active", "Expired") AS status 
               FROM orders o
               JOIN licenses l ON l.order_id=o.id
               JOIN features f ON o.feature_id=f.id
               WHERE o.company_id=${companyId} 
               GROUP BY o.id;`;
  return query(sql);
};

const getCompanyTransactionList = (companyId, currDate) => {
  const sql = `SELECT t.details AS transaction_type, t.timestamp AS transaction_date,
               o.id, o.license_type AS account_type, o.license_expiry AS license_renewal_date,
               COUNT(case when o.license_expiry > '${currDate}' then o.id else null end) - COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS available, 
               COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS active
               FROM transactions t
               JOIN orders o ON t.order_id=o.id
               JOIN licenses l ON l.order_id=o.id
               WHERE o.company_id=${companyId}
               GROUP BY t.id;`;
  return query(sql);
};

const getLicenses = (orderId) => {
  const sql = `SELECT id FROM licenses WHERE order_id=${orderId} AND user_id IS NULL;`;
  return query(sql);
};

const getOrderList = (agentIds) => {
  const sql = `SELECT id FROM orders WHERE agent_id IN (${agentIds}) ORDER BY id asc`;
  return query(sql);
};

const getUsers = (orderId) => {
  const sql = `SELECT id, display_name FROM users WHERE id IN (
                 SELECT user_id FROM licenses WHERE order_id=${orderId}
               );`;
  return query(sql);
};

const getFeatures = (orderId) => {
  const sql = `SELECT * FROM features WHERE id=(
                 SELECT feature_id FROM orders WHERE id=${orderId}
               );`;
  return query(sql);
};

const getOrderData = (orderId) => {
  const sql = `SELECT license_expiry AS expDate, license_type AS type FROM orders WHERE id=${orderId};`;
  return query(sql);
};

const getUnitPrices = (type, agentId) => {
  const sql = `SELECT monthly, quarterly, half_yearly, yearly FROM prices WHERE agent_id=${agentId} AND license_type='${type}';`;
  return query(sql);
};

const getLicensesForOrder = (orderId, userIds) => {
  const sql = `SELECT id FROM licenses WHERE order_id=${orderId} AND user_id IN (${userIds})`;
  return query(sql);
};

module.exports = {
  getOrders,
  createLicense,
  createFeatures,
  createOrder,
  findOrder,
  updateOrderId,
  getLicenseIds,
  getLicenseCount,
  createTransactionLog,
  getTransactionLogs,
  getCompanyOrderList,
  getCompanyTransactionList,
  getLicenses,
  getOrderList,
  getUsers,
  getFeatures,
  getOrderData,
  getUnitPrices,
  getLicensesForOrder,
};
