const query = require('../utils/queryTemplate');

const findDeptByUsername = (username) => {
  const sql = `SELECT id FROM departments WHERE username='${username}'`;
  return query(sql);
};

const findDepartmentById = (id) => {
  const sql = `SELECT id FROM departments WHERE id=${id};`;
  return query(sql);
};

const createDept = ({
  username,
  password,
  display_name: displayName,
  companyId,
}) => {
  const sql = `INSERT INTO departments 
               (username, password, display_name, company_id) 
               VALUES ('${username}', '${password}', '${displayName}', ${companyId});`;
  return query(sql);
};

const updateDepartment = (password, displayName, id) => {
  const sql = `UPDATE departments SET password='${password}', display_name='${displayName}' WHERE id=${id};`;
  return query(sql);
};

const deleteDepartment = (id) => {
  const sql = `DELETE FROM departments WHERE id=${id};`;
  return query(sql);
};

module.exports = {
  findDeptByUsername,
  createDept,
  updateDepartment,
  findDepartmentById,
  deleteDepartment,
};
