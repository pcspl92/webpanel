const query = require('../utils/queryTemplate');

const findDeptByUsername = (username) => {
  const sql = `SELECT id FROM departments WHERE username='${username}'`;
  return query(sql);
};

const createDept = ({ username, password, displayName, companyId }) => {
  const sql = `INSERT INTO departments 
               (username, password, display_name, company_id) 
               VALUES ('${username}', '${password}', '${displayName}', ${companyId});`;
  return query(sql);
};
const updatedepartment=(newname,newpassword)=>{
const sql = `UPDATE departments SET display_name='${newname}','${newpassword}'` ;
return query(sql);

}
module.exports = {
  findDeptByUsername,
  createDept,
  updatedepartment
};
