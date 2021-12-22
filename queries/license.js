const query = require('../utils/queryTemplate');

const createLicense = (
  licenseType,
  expiry,
  transactiondetails,
  transactionamount,
  companyid,
  userid,
  timestamp
) => {
  const sql = `INSERT INTO agents (license_type, monthly,quarterly,half_yearly,yearly,onetime,agentid,timestamp) VALUES ("${licenseType}","${expiry}","${transactiondetails}","${transactionamount}","${companyid}",""${userid}","${timestamp}",)`;
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
  findLicense,
};
