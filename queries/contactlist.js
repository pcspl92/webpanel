const query = require('../utils/queryTemplate');

const getContactListByName = (name) => {
  const sql = `SELECT id FROM contact_lists WHERE name=${name};`;
  return query(sql);
};

const getContactListById = (id) => {
  const sql = `SELECT * FROM contact_lists WHERE id=${id};`;
  return query(sql);
};

const getContactListJoined = (id) => {
  const sql = `SELECT display_name FROM users u JOIN users_add_data uad ON uad.user_id = u.id 
               WHERE (u.user_type='ptt' AND uad.contact_list_id=${id});`;
  return query(sql);
};

const createContactList = (name, companyId, userIds) => {
  const sql = `INSERT INTO contact_lists (name, companyId) VALUES ("${name}", ${companyId});
               UPDATE users_add_data SET contact_list_id=(SELECT LAST_INSERT_ID()) WHERE user_id IN (${userIds});`;
  return query(sql);
};

const updateContactList = (id, name, userIds) => {
  const sql = `UPDATE contact_lists SET name="${name}";
               UPDATE users_add_data SET contact_list_id=${id} WHERE user_id IN (${userIds});`;
  return query(sql);
};

const deleteContactList = (id) => {
  const sql = `DELETE FROM users_add_data WHERE contact_list_id=${id};
               DELETE FROM contact_lists WHERE id=${id};`;
  return query(sql);
};

module.exports = {
  getContactListByName,
  getContactListById,
  getContactListJoined,
  createContactList,
  updateContactList,
  deleteContactList,
};
