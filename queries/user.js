const query = require('../utils/queryTemplate');

const getUsersAgentPanel = (agentIds) => {
  const sql = `SELECT o.license_expiry AS license_expiry, o.license_type AS account_type, a.display_name AS agent_name,
               c.display_name AS company_name, l.id AS license_id, u.username AS account_name, u.display_name AS user_name 
               FROM orders o
               JOIN agents a ON o.agent_id = a.id
               JOIN companies c ON o.company_id = c.id
               JOIN licenses l ON l.order_id = o.id
               JOIN users u ON l.user_id = u.id
               WHERE o.agent_id IN (${agentIds});`;
  return query(sql);
};

const getPttUsers = (companyId) => {
  // working
  const sql = ``;
  return query(sql);
};

module.exports = { getUsersAgentPanel, getPttUsers };
