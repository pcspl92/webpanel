const query = require('../utils/queryTemplate');

const findCompany = (username) => {
  const sql = `SELECT id, password, display_name FROM companies WHERE username="${username}";`;
  return query(sql);
};

const findCompanyByUsername = (username) => {
  const sql = `SELECT id FROM companies WHERE username='${username}'`;
  return query(sql);
};

const getDepartmentCount = (id) => {
  const sql = `SELECT COUNT(id) AS count FROM departments WHERE company_id=${id};`;
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

const updateCompanyPassword = (password, companyId) => {
  const sql = `UPDATE companies SET password="${password}" WHERE id=${companyId};`;
  return query(sql);
};

const findCompanies = () => {
  const sql = `SELECT  username,display_name,contact_number,timestamp`;
  return query(sql);
};

const updateCompany = (
  newpassword,
  newcompanyname,
  newcontactnumber,
  newsubagent
) => {
  const sql = `UPDATE  companies SET password='${newpassword}' diplay_name='${newcompanyname}',contact_number='${newcontactnumber}',agent_id='${newsubagent}'`;
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

const getCompanyLoginLogs = (id) => {
  const sql = `SELECT * FROM company_login_logs WHERE company_id=${id};`;
  return query(sql);
};

const getCompanyActivityLogs = (id) => {
  const sql = `SELECT * FROM company_activity_logs WHERE company_id=${id};`;
  return query(sql);
};

module.exports = {
  findCompany,
  findCompanyByUsername,
  createCompany,
  findCompanies,
  updateCompanyPassword,
  updateCompany,
  getDepartmentCount,
  getDashboardData,
  createCompanyAuthLog,
  createCompanyActivityLog,
  getCompanyLoginLogs,
  getCompanyActivityLogs,
};
