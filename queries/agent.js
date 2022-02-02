const query = require('../utils/queryTemplate');

const findAgent = (username) => {
  const sql = `SELECT id, password, display_name, agent_type FROM agents WHERE username="${username}";`;
  return query(sql);
};

const findAgentById = (agentId) => {
  const sql = `SELECT id FROM agents WHERE id=${agentId};`;
  return query(sql);
};

const getAgentId = (subagentId) => {
  const sql = `SELECT agent_id AS agentId FROM agents WHERE id=${subagentId};`;
  return query(sql);
};

const getSubAgents = (agentId) => {
  const sql = `SELECT s.id FROM agents s JOIN agents a ON s.agent_id = a.id WHERE a.id=${agentId};`;
  return query(sql);
};

const getTotalCompanyCount = (agentIds) => {
  const sql = `SELECT COUNT(id) AS total_companies FROM companies WHERE agent_id IN (${agentIds});`;
  return query(sql);
};

const getSubAgentNames = (agentId) => {
  const sql = `SELECT display_name, a.id, ad.balance FROM agents a
               JOIN agents_add_data ad ON a.id = ad.agent_id
               WHERE a.agent_id=${agentId};`;
  return query(sql);
};

const createAgent = (username, password, displayname, agenttype, agentid) => {
  const sql = `INSERT INTO agents (username, password, display_name, agent_type, agent_id) VALUES ("${username}","${password}","${displayname}","${agenttype}",${agentid}); `;
  return query(sql);
};

const addAgentDetails = (contactNumber, agentId) => {
  const sql = `INSERT INTO agents_add_data (contact_number, agent_id) VALUES ("${contactNumber}", ${agentId})`;
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

const getSubAgentBalance = (subAgentId) => {
  const sql = `SELECT balance AS subAgentBalance FROM agents_add_data WHERE agent_id=${subAgentId};`;
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

const createAgentAuthLog = (desc, ip, agentId) => {
  const sql = `INSERT INTO agent_login_logs (login_desc, ipaddress, agent_id) VALUES ("${desc}", "${ip}", ${agentId});`;
  return query(sql);
};

const createAgentActivityLog = (desc, agentId) => {
  const sql = `INSERT INTO agent_activity_logs (activity_desc, agent_id) VALUES ("${desc}", ${agentId});`;
  return query(sql);
};

const getAgentAuthLogs = (id) => {
  const sql = `SELECT * FROM agent_login_logs WHERE agent_id=${id};`;
  return query(sql);
};

const getAgentActivityLogs = (id) => {
  const sql = `SELECT aal.activity_desc, aal.id, aal.timestamp, a.display_name AS agent_name FROM agent_activity_logs aal 
               JOIN agents a ON aal.agent_id = a.id WHERE aal.agent_id=${id};`;
  return query(sql);
};

const getAgentUnitPrice = (agentId, licenseType, renewal, agentType) => {
  let sql = `SELECT ${renewal} AS unitPrice FROM prices WHERE (agent_id=${agentId} AND license_type="${licenseType}")`;
  if (agentType === 'subagent') {
    sql = `SELECT ${renewal} AS agentUnitPrice FROM prices WHERE (agent_id=(SELECT agent_id FROM agents WHERE id=${agentId}) AND license_type="${licenseType}")`;
  }
  return query(sql);
};

const deductBalance = (amount, agentId) => {
  const sql = `UPDATE agents_add_data SET balance=balance-${amount} WHERE agent_id=${agentId};`;
  return query(sql);
};

const addProfit = (profit, subAgentId) => {
  const sql = `UPDATE agents_add_data SET balance=balance+${profit}
               WHERE agent_id = (
                 SELECT agent_id FROM agents WHERE id=${subAgentId}
               );`;
  return query(sql);
};

const viewSubAgentData = (subAgentIds) => {
  const sql = `SELECT COUNT(o.id) - COUNT(l.user_id) AS available, COUNT(l.user_id) AS active, COUNT(DISTINCT o.id) AS orders,
               a.username AS account_name, a.display_name AS agent_name, a.id
               FROM agents a 
               LEFT JOIN orders o ON o.agent_id = a.id
               LEFT JOIN licenses l ON o.id = l.order_id
               GROUP BY a.id
               HAVING a.id IN (${subAgentIds});`;
  return query(sql);
};

const getDashboardData = (agentIds, currDate) => {
  const sql = `SELECT COUNT(case when o.license_expiry > '${currDate}' then o.id else null end) - COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS available, 
               COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS active, 
               COUNT(case when o.license_expiry <= '${currDate}' then o.id else null end) AS expired, 
               COUNT(o.id) AS total,
               o.license_type
               FROM orders o 
               JOIN licenses l ON l.order_id = o.id
               WHERE o.agent_id IN (${agentIds}) 
               GROUP BY o.license_type;`;
  return query(sql);
};

module.exports = {
  findAgent,
  findAgentById,
  getAgentId,
  getSubAgents,
  getSubAgentNames,
  deductBalance,
  createAgent,
  addAgentDetails,
  addPriceDetails,
  updatePriceDetails,
  getTotalCompanyCount,
  rechargeSubAgent,
  getAgentBalance,
  getAgentUnitPrice,
  updateSubAgent,
  updateAgentPassword,
  getAgentAuthLogs,
  getAgentActivityLogs,
  addProfit,
  viewSubAgentData,
  getDashboardData,
  createAgentAuthLog,
  createAgentActivityLog,
  getSubAgentBalance,
};
