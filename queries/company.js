const query = require('../utils/queryTemplate');

const findCompany = (username) => {
  const sql = `SELECT id, password, display_name FROM companies WHERE username="${username}";`;
  return query(sql);
};

const findCompanyByUsername = (username) => {
  const sql = `SELECT id FROM companies WHERE username='${username}'`;
  return query(sql);
};

const createCompany = ({
  username,
  password,
  displayName,
  contactNumber,
  agentId,
}) => {
  const sql = `INSERT INTO companies 
               (username, password, display_name, contact_number, agent_id) 
               VALUES ('${username}', '${password}', '${displayName}', '${contactNumber}', ${agentId});`;
  return query(sql);
};

module.exports = {
  findCompany,
  findCompanyByUsername,
  createCompany,
};
