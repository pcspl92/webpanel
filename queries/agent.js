const query = require('../utils/queryTemplate');

const findAgent = (username) => {
  const sql = `SELECT id, password, display_name, agent_type FROM agents WHERE username="${username}"`;
  return query(sql);
};

module.exports = {
  findAgent,
};
