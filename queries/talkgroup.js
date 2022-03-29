const query = require('../utils/queryTemplate');

const findTGByName = (tgName) => {
  const sql = `SELECT id FROM talkgroups WHERE talkgroup_name='${tgName}';`;
  return query(sql);
};

const findTGById = (id) => {
  const sql = `SELECT id FROM talkgroups WHERE id=${id};`;
  return query(sql);
};

const getTGs = (companyId) => {
  const sql = `SELECT id, talkgroup_name AS tg_name FROM talkgroups WHERE company_id=${companyId};`;
  return query(sql);
};
const TGid = () => {
  const sql = `SELECT (MAX(id)+1 ) AS talkgroup_id FROM talkgroups;`;
  return query(sql);
};
const createTG = (name, companyId) => {
  const sql = `INSERT INTO talkgroups (talkgroup_name, company_id) VALUES ('${name}', ${companyId});`;
  return query(sql);
};

const updateTG = (name, id) => {
  const sql = `UPDATE talkgroups SET talkgroup_name='${name}' WHERE id=${id};`;
  return query(sql);
};
const deleteTG = (id) => {
  const sql = `DELETE FROM talkgroups  WHERE id=${id};`;
  return query(sql);
};
const deleteTGMap = (id) => {
  const sql = `DELETE FROM user_talkgroup_maps  WHERE talkgroup_id=${id} OR default_tg=${id};`;
  return query(sql);
};
module.exports = {
  findTGByName,
  findTGById,
  getTGs,
  createTG,
  updateTG,
  TGid,
  deleteTG,
  deleteTGMap,
};
