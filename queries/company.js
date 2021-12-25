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
  display_name: displayName,
  constact_number: contactNumber,
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

const updateCompany = (newpassword,newcompanyname,newcontactnumber,newsubagent) => {
  const sql = `UPDATE  companies SET password='${newpassword}' diplay_name='${newcompanyname}',contact_number='${newcontactnumber}',agent_id='${newsubagent}'`;
  return query(sql);
};

const fetchloglist=(id)=>{
  const sql = `SELECT login_desc, ipaddress, timestamp  FROM company_login_logs WHERE company_id="${id}"`;
  return query(sql);
}
module.exports = {
  findCompany,
  findCompanyByUsername,
  createCompany,
  findCompanies,
  updateCompanyPassword,
  updateCompany,
  fetchloglist
};
