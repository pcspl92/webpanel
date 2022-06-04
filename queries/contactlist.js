const query = require('../utils/queryTemplate');

const getContactListByName = (name) => {
  const sql = `SELECT id FROM contact_lists WHERE name='${name}';`;
  return query(sql);
};

const getContactListUserData = (contactListId) => {
  const sql = `SELECT * FROM contact_list_user_maps WHERE contact_list_id=${contactListId};`;
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
const CLid = () => {
  const sql = `SELECT (MAX(id)+1 ) AS contactlist_id FROM contact_lists;`;
  return query(sql);
};
const createContactList = (name, companyId) => {
  const sql = `INSERT INTO contact_lists (name, company_id) VALUES ('${name}', ${companyId});`;
  return query(sql);
};

const createUserContactListMaps = (contactListId, userIds) => {
  const sql = userIds.reduce((acc, userId, index) => {
    if (index === userIds.length - 1)
      return `${acc} (${contactListId}, ${userId});`;
    return `${acc} (${contactListId}, ${userId}),`;
  }, `INSERT INTO contact_list_user_maps (contact_list_id, user_id) VALUES`);
  return query(sql);
};

const deleteUserContactListMaps = (contactListId) => {
  const sql = `DELETE FROM contact_list_user_maps WHERE contact_list_id=${contactListId};`;
  return query(sql);
};
const deleteUserAdddata = (contactListId) => {
  const sql = `UPDATE  users_add_data SET contact_list_id=NULL WHERE contact_list_id=${contactListId};`;
  return query(sql);
};

const updateContactList = (id, name) => {
  const sql = `UPDATE contact_lists SET name='${name}' WHERE id=${id};`;
  return query(sql);
};

const deleteContactList = (id) => {
  const sql = `DELETE FROM contact_lists WHERE id=${id};`;
  return query(sql);
};

module.exports = {
  getContactListByName,
  getContactListById,
  getContactLists,
  getContactListUserData,
  createContactList,
  updateContactList,
  deleteContactList,
  createUserContactListMaps,
  deleteUserContactListMaps,
  CLid,
  deleteUserAdddata,
};
