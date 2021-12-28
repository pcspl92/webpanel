const query = require('../utils/queryTemplate');

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
  const sql = `INSERT INTO orders (license_type, license_expiry, company_id, feature_id, renewal, agent_id) 
               VALUES ("${licenseType}", "${licenseExpiry}", ${companyId}, ${featureId}, ${renewal}, ${agentId});`;
  return query(sql);
};

const createLicense = (orderId, qty) => {
  const sql = `CALL create_licenses(${orderId}, ${qty});`;
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
  createLicense,
  createFeatures,
  createOrder,
  findOrder,
  updateOrderId,
  getLicenseIds,
  getLicenseCount,
};
