const query = require('../utils/queryTemplate');

const findCompany = (username) => {
  const sql = `SELECT id, password, display_name FROM companies WHERE username="${username}"`;
  return query(sql);
};

module.exports = {
  findCompany,
};
