const query = require('../utils/queryTemplate');

const getContactListByName = (name) => {
  const sql = `SELECT id FROM contact_lists WHERE name=${name};`;
  return query(sql);
};

const getContactListById = (id) => {
  const sql = `SELECT * FROM contact_lists WHERE id=${id};`;
  return query(sql);
};

const getContactLists = (companyId) => {
  const sql = `SELECT id, name AS display_name FROM contact_lists WHERE company_id=${companyId};`;
  return query(sql);
};

const createContactList = (name, companyId, userIds) => {
  const sql1 = `INSERT INTO contact_lists (name, companyId) VALUES ("${name}", ${companyId});`;
  const sql2 = `UPDATE users_add_data SET contact_list_id=(SELECT LAST_INSERT_ID()) WHERE user_id IN (${userIds});`;
  return [query(sql1), query(sql2)];
};

const updateContactList = (id, name, userIds) => {
  const sql1 = `UPDATE contact_lists SET name="${name}";`;
  const sql2 = `UPDATE users_add_data SET contact_list_id=${id} WHERE user_id IN (${userIds});`;
  return [query(sql1), query(sql2)];
};

const deleteContactList = (id) => {
  const sql = `DELETE FROM contact_lists WHERE id=${id};`;
  return query(sql);
};

module.exports = {
  getContactListByName,
  getContactListById,
  getContactLists,
  createContactList,
  updateContactList,
  deleteContactList,
};
