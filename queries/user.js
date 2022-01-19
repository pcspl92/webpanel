const query = require('../utils/queryTemplate');

const findUserByUsername = (username) => {
  const sql = `SELECT id FROM users WHERE username='${username}'`;
  return query(sql);
};

const findUserById = (id, type) => {
  const sql = `SELECT id FROM users WHERE id=${id} AND user_type='${type}';`;
  return query(sql);
};

const getUsersAgentPanel = (agentIds) => {
  const sql = `SELECT o.license_expiry AS license_expiry, o.license_type AS account_type, a.display_name AS agent_name,
               c.display_name AS company_name, l.id AS license_id, u.username AS account_name, u.display_name AS user_name 
               FROM orders o
               JOIN agents a ON o.agent_id = a.id
               JOIN companies c ON o.company_id = c.id
               JOIN licenses l ON l.order_id = o.id
               JOIN users u ON l.user_id = u.id
               WHERE o.agent_id IN (${agentIds});`;
  return query(sql);
};

const getUsers = (deptIds, type) => {
  const sql = `SELECT id, display_name FROM users WHERE department_id IN (${deptIds}) AND user_type='${type}';`;
  return query(sql);
};

const createUser = (type, username, password, displayName, deptId) => {
  const sql = `INSERT INTO users (user_type, username, password, display_name, department_id) 
               VALUES ('${type}', '${username}', '${password}', '${displayName}', ${deptId})`;
  return query(sql);
};

const updateLicense = (licenseId, userId) => {
  const sql = `UPDATE licenses SET user_id=${userId} WHERE id=${licenseId};`;
  return query(sql);
};

const createUserAddData = (
  {
    grp_call: grpCall,
    enc,
    priv_call: privCall,
    live_gps: liveGps,
    geo_fence: geoFence,
    chat,
  },
  contactNumber,
  contactListId,
  userId
) => {
  const sql1 = `INSERT INTO users_add_data (contact_no, contact_list_id, user_id) VALUES ('${contactNumber}', ${contactListId}, ${userId});`;
  const sql2 = `INSERT INTO user_features (grp_call, enc, priv_call, live_gps, geo_fence, chat, user_id) 
                VALUES (${grpCall}, ${enc}, ${privCall}, ${liveGps}, ${geoFence}, ${chat}, ${userId});`;
  return [query(sql1), query(sql2)];
};

const mapUserTalkgroup = (tgIds, defTg, userId) => {
  const sql = tgIds.reduce((acc, tgId, index) => {
    if (index === tgIds.length - 1)
      return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0});`;
    return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0}),`;
  }, `INSERT INTO user_talkgroup_maps (user_id, talkgroup_id, default_tg) VALUES`);
  return query(sql);
};

const mapControlStations = (controlIds, userId) => {
  const sql = `UPDATE users_add_data SET dispatcher_id=${userId} WHERE user_id IN (${controlIds});`;
  return query(sql);
};

const updateUser = (password, displayName, deptId, userId) => {
  const sql = `UPDATE users SET password='${password}', display_name='${displayName}', department_id=${deptId} WHERE id=${userId};`;
  return query(sql);
};

const updateUserAddData = (
  {
    grp_call: grpCall,
    enc,
    priv_call: privCall,
    live_gps: liveGps,
    geo_fence: geoFence,
    chat,
  },
  contactNumber,
  contactListId,
  userId
) => {
  const sql1 = `UPDATE users_add_data SET contact_no='${contactNumber}', contact_list_id=${contactListId} WHERE user_id=${userId};`;
  const sql2 = `UPDATE user_features SET grp_call=${grpCall}, enc=${enc}, priv_call=${privCall}, live_gps=${liveGps}, geo_fence=${geoFence}, chat=${chat}
                WHERE user_id=${userId};`;
  return [query(sql1), query(sql2)];
};

const deleteUserTalkgroupMaps = (userId) => {
  const sql = `DELETE FROM user_talkgroup_maps WHERE user_id=${userId};`;
  return query(sql);
};

module.exports = {
  findUserByUsername,
  findUserById,
  getUsersAgentPanel,
  getUsers,
  createUser,
  createUserAddData,
  mapUserTalkgroup,
  updateLicense,
  mapControlStations,
  updateUser,
  updateUserAddData,
  deleteUserTalkgroupMaps,
};
