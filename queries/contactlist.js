const query = require('../utils/queryTemplate');

const findCLByName = (tgName) => {
    const sql = `SELECT id FROM contactlists WHERE contactlist_name='${tgName}'`;
    return query(sql);
  
  };
const createCL = (clName,companyId) => {
    const sql = `INSERT INTO contactlist 
                 (contactlist_name, company_id) 
                 VALUES ('${clName}', ${companyId});`;
    return query(sql);
  };

  module.exports = {
    findCLByName,
    createCL,
  };