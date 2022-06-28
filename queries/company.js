const query = require('../utils/queryTemplate');

const findCompanyById = (id) => {
  const sql = `SELECT id, status,password FROM companies WHERE id=${id};`;
  return query(sql);
};

const findCompanyByUsername = (username) => {
  const sql = `SELECT id, password, display_name, status FROM companies WHERE username="${username}";`;
  return query(sql);
};

const getCompanies = (agentIds) => {
  const sql = `SELECT id, display_name, status FROM companies WHERE agent_id IN (${agentIds})`;
  return query(sql);
};

const getCompanyViewData = (agentIds) => {
  const sql = `SELECT c.id, c.username AS account_name, c.display_name AS company_name, 
               c.timestamp, c.contact_number, a.display_name AS agent_name, c.status AS company_status, a.status AS agent_status
               FROM companies c
               JOIN agents a ON c.agent_id = a.id
               WHERE c.agent_id IN (${agentIds});`;
  return query(sql);
};

const createCompany = ({
  username,
  password,
  display_name: displayName,
  contact_number: contactNumber,
  agentId,
}) => {
  const sql = `INSERT INTO companies 
               (username, password, display_name, contact_number, agent_id) 
               VALUES ("${username}", "${password}", "${displayName}", "${contactNumber}", ${agentId});`;
  return query(sql);
};

const checkAgent =async(agentId)=>{
  const sql =`SELECT * from agents WHERE id=${agentId}`
  const execute = await query(sql)
  // console.log(execute)
  return execute[0].status
}

const updateCompanyPassword = (password, companyId) => {
  const sql = `UPDATE companies SET password="${password}" WHERE id=${companyId};`;
  return query(sql);
};

const updateCompany = (
  id,
  password,
  displayName,
  contactNumber,
  status,
  agentId
) => {
  const sql = `UPDATE companies SET password='${password}', display_name='${displayName}', 
               contact_number='${contactNumber}', agent_id=${agentId}, status='${status}' WHERE id=${id};`;
  return query(sql);
};

const relieveCompany = (agentId, id) => {
  const sql = `UPDATE companies SET agent_id=${agentId} WHERE id=${id};`;
  return query(sql);
};

const getDashboardData = (id, currDate) => {
  const sql = `SELECT COUNT(case when o.license_expiry > '${currDate}' then o.id else null end) - COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS available, 
               COUNT(case when o.license_expiry > '${currDate}' then l.user_id else null end) AS active, 
               COUNT(case when o.license_expiry <= '${currDate}' then o.id else null end) AS expired, 
               COUNT(o.id) AS total,
               o.license_type
               FROM orders o 
               JOIN licenses l ON l.order_id = o.id
               WHERE o.company_id=${id}
               GROUP BY o.license_type;`;
  return query(sql);
};

const createCompanyAuthLog = (desc, ip, companyId) => {
  const sql = `INSERT INTO company_login_logs (login_desc, ipaddress, company_id) VALUES ("${desc}", "${ip}", ${companyId});`;
  return query(sql);
};

const createCompanyActivityLog = (desc, companyId) => {
  const sql = `INSERT INTO company_activity_logs (activity_desc, company_id) VALUES ("${desc}", ${companyId});`;
  return query(sql);
};

const getCompanyAuthLogs = (id) => {
  const sql = `SELECT * FROM company_login_logs WHERE company_id=${id} ORDER BY timestamp ASC;`;
  return query(sql);
};

const getCompanyActivityLogs = (id) => {
  const sql = `SELECT cal.activity_desc, cal.id, cal.timestamp, c.display_name FROM company_activity_logs cal 
               JOIN companies c ON cal.company_id = c.id WHERE cal.company_id=${id};`;
  return query(sql);
};

const deleteCompany = (id) => {
  const sql = `DELETE FROM companies WHERE id=${id}`;
  return query(sql);
};

module.exports = {
  findCompanyByUsername,
  findCompanyById,
  createCompany,
  updateCompanyPassword,
  updateCompany,
  relieveCompany,
  getDashboardData,
  createCompanyAuthLog,
  createCompanyActivityLog,
  getCompanyAuthLogs,
  getCompanyActivityLogs,
  getCompanies,
  getCompanyViewData,
  deleteCompany,
  checkAgent
};
