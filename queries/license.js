const query = require('../utils/queryTemplate');

const createFeatures = ({
  grp_call: grpCall,
  enc,
  priv_call: privCall,
  live_gps: liveGps,
  geo_fence: geoFence,
  chat,
}) => {
  const sql = `INSERT INTO features (grp_call, enc, priv_call, live_gps, geo_fence, chat) VALUES (${grpCall}, ${enc}, ${privCall}, ${liveGps}, ${geoFence}, ${chat});`;
  return query(sql);
};

const createOrder = (
  licenseType,
  licenseExpiry,
  companyId,
  featureId,
  agentId
) => {
  const sql = `INSERT INTO orders (license_type, license_expiry, company_id, feature_id, agent_id) VALUES ("${licenseType}", "${licenseExpiry}", ${companyId}, ${featureId}, ${agentId});`;
  return query(sql);
};

const createLicense = (orderId, qty) => {
  const sql = `CALL create_licenses(${orderId}, ${qty});`;
  return query(sql);
};

const findLicense = () => {
  const sql = ` SELECT licenses.license_type,license_expiry,features.grp_call,features.enc,features.live_gps,features.geo_fence,features.chat,
     FROM licenses
     INNER JOIN features ON licenses.id = features.license_id;`;
  return query(sql);
};

module.exports = {
  createLicense,
  createFeatures,
  createOrder,
  findLicense,
};
