
const query = require('../utils/queryTemplate');

const findTGByName = (tgName) => {
  const sql = `SELECT id FROM talkgroups WHERE talkgroup_name='${tgName}'`;
  return query(sql);

};

const createTG = ({ tgName, companyId }) => {
  const sql = `INSERT INTO talkgroups 
               (talkgroup_name, company_id) 
               VALUES ('${tgName}', ${companyId});`;
  return query(sql);
};

module.exports = {
  findTGByName,
  createTG,
};
