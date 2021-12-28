const query = require('../utils/queryTemplate');

const findAgent = (username) => {
  const sql = `SELECT id, password, display_name, agent_type FROM agents WHERE username="${username}"`;
  return query(sql);
};

const findAgentById = (agentId) => {
  const sql = `SELECT id FROM agents WHERE id=${agentId}`;
  return query(sql);
};

const createAgent = (username, password, displayname, agenttype, agentid) => {
  const sql = `INSERT INTO agents (username, password,display_name,agent_type,agent_id) VALUES ("${username}","${password}","${displayname}","${agenttype}","${agentid}";) `;
  return query(sql);
};

const addAgentdetials = (balance, contactnumber, agentid) => {
  const sql = `INSERT INTO agents_add_data (balance, contact_number, agent_id) VALUES ("${balance}","${contactnumber}",${agentid})`;
  return query(sql);
};

const addPriceDetails = (
  pmonthly,
  pquarterly,
  phalfyearly,
  pyearly,
  ponetime,
  dmonthly,
  dquarterly,
  dhalfyearly,
  dyearly,
  donetime,
  cmonthly,
  cquarterly,
  chalfyearly,
  cyearly,
  conetime,
  agentid
) => {
  const sql = `INSERT INTO prices (license_type, monthly, quarterly, half_yearly, yearly, one_time, agent_id) VALUES 
               ("ptt",${pmonthly},${pquarterly},${phalfyearly},${pyearly},${ponetime},${agentid}),
               ("dispatcher",${dmonthly},${dquarterly},${dhalfyearly},${dyearly},${donetime},${agentid}),
               ("control",${cmonthly},${cquarterly},${chalfyearly},${cyearly},${conetime},${agentid});`;
  return query(sql);
};

const updatePriceDetails = (
  pmonthly,
  pquarterly,
  phalfyearly,
  pyearly,
  ponetime,
  dmonthly,
  dquarterly,
  dhalfyearly,
  dyearly,
  donetime,
  cmonthly,
  cquarterly,
  chalfyearly,
  cyearly,
  conetime,
  agentId
) => {
  const sql1 = `UPDATE prices SET monthly=${pmonthly}, quarterly=${pquarterly}, half_yearly=${phalfyearly}, yearly=${pyearly}, one_time=${ponetime}
               WHERE (agent_id=${agentId} AND license_type='ptt');`;
  const sql2 = `UPDATE prices SET monthly=${dmonthly}, quarterly=${dquarterly}, half_yearly=${dhalfyearly}, yearly=${dyearly}, one_time=${donetime}
               WHERE (agent_id=${agentId} AND license_type='dispatcher');`;
  const sql3 = `UPDATE prices SET monthly=${cmonthly}, quarterly=${cquarterly}, half_yearly=${chalfyearly}, yearly=${cyearly}, one_time=${conetime}
               WHERE (agent_id=${agentId} AND license_type='control');`;
  return [query(sql1), query(sql2), query(sql3)];
};

const rechargeSubAgent = (subAgentId, agentId, amount) => {
  const sql1 = `UPDATE agents_add_data SET balance=balance+${amount} WHERE agent_id=${subAgentId};`;
  const sql2 = `UPDATE agents_add_data SET balance=balance-${amount} WHERE agent_id=${agentId}`;
  return [query(sql1), query(sql2)];
};

const getAgentBalance = (agentId) => {
  const sql = `SELECT balance FROM agents_add_data WHERE agent_id=${agentId};`;
  return query(sql);
};

const updateSubAgent = (displayName, contactNumber, password, subagentId) => {
  const sql1 = `UPDATE agents SET display_name="${displayName}", password="${password}" WHERE id=${subagentId};`;
  const sql2 = `UPDATE agents_add_data SET contact_number="${contactNumber}" WHERE agent_id=${subagentId};`;
  return [query(sql1), query(sql2)];
};

const updateAgentPassword = (password, agentId) => {
  const sql = `UPDATE agents SET password="${password}" WHERE id=${agentId};`;
  return query(sql);
};

const fetchloglist = (id) => {
  const sql = `SELECT login_desc, ipaddress, timestamp  FROM agent_login_logs WHERE agent_id="${id}"`;
  return query(sql);
};

const fetchActivityList = (id) => {
  const sql = `SELECT login_desc, ipaddress, timestamp  FROM agent_login_logs WHERE agent_id="${id}"`;
  return query(sql);
};

const getAgentUnitPrice = (agentId, licenseType, renewal) => {
  const sql = `SELECT ${renewal} AS unitPrice FROM prices WHERE (agent_id=${agentId} AND license_type="${licenseType}")`;
  return query(sql);
};

const deductBalance = (amount, agentId) => {
  const sql = `UPDATE agents_add_data SET balance=balance-${amount} WHERE agent_id=${agentId};`;
  return query(sql);
};

module.exports = {
  findAgent,
  findAgentById,
  deductBalance,
  createAgent,
  addAgentdetials,
  addPriceDetails,
  updatePriceDetails,
  rechargeSubAgent,
  getAgentBalance,
  getAgentUnitPrice,
  updateSubAgent,
  updateAgentPassword,
  fetchloglist,
  fetchActivityList,
};
