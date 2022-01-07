const query = require('../utils/queryTemplate');

const getOrders = (subAgents) => {
  const sql = `SELECT o.id AS order_id, o.timestamp AS order_date, license_type, license_expiry AS expiry_date, renewal AS renewal_type,
               a.display_name AS agent_name, c.display_name AS company_name,
               f.grp_call, f.enc, f.priv_call, f.live_gps, f.geo_fence, f.chat, 
               COUNT(l.id) - COUNT(l.user_id) AS available, COUNT(l.user_id) AS active
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
    .fill(`VALUES (${orderId}) `)
    .reduce((acc, val) => acc + val, `INSERT INTO licenses (order_id) `);
  return query(sql);
};

const findOrder = (orderId) => {
  const sql = ` SELECT * FROM orders WHERE id=${orderId}`;
  return query(sql);
};

const updateOrderId = (licenseIds, newOrderId, oldOrderId, all) => {
  let sql = `UPDATE licenses SET order_id=${newOrderId} WHERE id IN (${licenseIds})`;
  if (all)
    sql = `UPDATE licenses SET order_id=${newOrderId} WHERE order_id=${oldOrderId}`;
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

module.exports = {
  getOrders,
  createLicense,
  createFeatures,
  createOrder,
  findOrder,
  updateOrderId,
  getLicenseIds,
  getLicenseCount,
};
