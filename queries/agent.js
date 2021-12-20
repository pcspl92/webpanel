const query = require('../utils/queryTemplate');

const findAgent = (username) => {
  const sql = `SELECT id, password, display_name, agent_type FROM agents WHERE username="${username}"`;
  return query(sql);
};

const createAgent = (username, password, displayname, agenttype, agentid) => {
  const sql = `INSERT INTO agents (username, password,display_name,agent_type,agent_id) VALUES ("${username}","${password}","${displayname}","${agenttype}","${agentid}",) `;
  return query(sql);
};
const addAgentdetials = (balance, contactnumber, agentid, timestamp) => {
  const sql = `INSERT INTO agents (balance, contact_number,agent_id,timestamp) VALUES ("${balance}","${contactnumber}","${agentid}","${timestamp}",)`;
  return query(sql);
};
const addPriceDetails = (
  licenseType,
  monthly,
  quarterly,
  halfyearly,
  yearly,
  onetime,
  agentid,
  timestamp
) => {
  const sql = `INSERT INTO agents (license_type, monthly,quarterly,half_yearly,yearly,onetime,agentid,timestamp) VALUES ("${licenseType}","${monthly}","${quarterly}","${halfyearly}","${yearly}","${onetime}","${agentid}","${timestamp}",)`;
  return query(sql);
};

module.exports = {
  findAgent,
  createAgent,
  addAgentdetials,
  addPriceDetails,
};
