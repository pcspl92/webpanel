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

  const findLicense = (username) => {
    const sql = `SELECT FROM license WHERE username="${username}"`;
    return query(sql);
  };
  module.exports = {
    createLicense,
 findLicense
  };