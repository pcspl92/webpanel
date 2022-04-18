const query = require('../utils/queryTemplate');
const { talkgroupMap, controlStationMap } = require('../utils/sqlMaps');

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
               c.display_name AS company_name, l.id AS license_id, u.username AS account_name, u.display_name AS user_name  ,a.status AS status
               FROM orders o
               JOIN agents a ON o.agent_id = a.id
               JOIN companies c ON o.company_id = c.id
               JOIN licenses l ON l.order_id = o.id
               JOIN users u ON l.user_id = u.id
               WHERE o.agent_id IN (${agentIds})
               UNION
               SELECT o.license_expiry AS license_expiry, o.license_type AS account_type, a.display_name AS agent_name,
               c.display_name AS company_name, l.id AS license_id,cu.display_name AS user_name , cu.display_name AS csuser_name  ,a.status AS status
               FROM orders o
               JOIN agents a ON o.agent_id = a.id
               JOIN companies c ON o.company_id = c.id
               JOIN licenses l ON l.order_id = o.id
               JOIN control_station_user cu ON   l.control_station_user_id=cu.id
               WHERE o.agent_id IN (${agentIds})
               
               ;`;
  return query(sql);
};

const viewUsersCompanyPanel = (companyId, currDate) => {
  const sql = `SELECT u.username AS account_name, u.display_name AS user_display_name, u.user_type AS account_type,
               uad.timestamp AS creation_date, uad.contact_no AS contact_person,
               o.license_expiry AS license_renewal, o.id AS order_id,o.renewal AS license_type, IF(o.license_expiry > '${currDate}', "Normal", "Expired") AS status,
               uf.grp_call, uf.enc, uf.priv_call, uf.live_gps, uf.geo_fence, uf.chat 
               FROM users u
               JOIN users_add_data uad ON uad.user_id=u.id
               JOIN licenses l ON l.user_id=u.id
               JOIN orders o ON l.order_id=o.id
               JOIN user_features uf ON uf.user_id=u.id
               WHERE u.company_id = ${companyId}
               UNION
               SELECT u.display_name AS account_name, u.display_name AS user_display_name, l.user_type AS account_type,
               u.timestamp AS creation_date, u.contact_no AS contact_person,
               o.license_expiry AS license_renewal, o.id AS order_id,o.renewal AS license_type, IF(o.license_expiry > '${currDate}', "Normal", "Expired") AS status,
               null AS grp_call, null AS enc, null AS priv_call, null AS live_gps, null AS geo_fence, null AS chat 
               FROM control_station_user u
               JOIN users_add_data uad ON uad.user_id=u.id
               JOIN licenses l ON l.control_station_user_id=u.id
               JOIN orders o ON l.order_id=o.id
               WHERE u.company_id = ${companyId}
               ;`;
  return query(sql);
};
const getUsers = (companyId, type) => {
  const sql = `SELECT id, display_name FROM users WHERE company_id = ${companyId} AND user_type='${type}';`;
  return query(sql);
};

const createUser = (type, username, password, displayName, companyId) => {
  const sql = `INSERT INTO users (user_type, username, password, display_name, company_id) 
               VALUES ('${type}', '${username}', '${password}', '${displayName}', '${companyId}')`;
  return query(sql);
};

const updateLicense = (licenseId, userId) => {
  const sql = `UPDATE licenses SET user_id=${userId},user_type="ptt/dispatcher" WHERE id=${licenseId};`;
  return query(sql);
};
const CSupdateLicense = (licenseId, userId) => {
  const sql = `UPDATE licenses SET control_station_user_id=${userId},user_type="control" WHERE id=${licenseId};`;
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
  let sql;
  if (defTg)
    sql = tgIds.reduce((acc, tgId, index) => {
      if (index === tgIds.length - 1)
        return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0});`;
      return `${acc} (${userId}, ${tgId}, ${tgId === defTg ? 1 : 0}),`;
    }, `INSERT INTO user_talkgroup_maps (user_id, talkgroup_id, default_tg) VALUES`);
  else
    sql = tgIds.reduce((acc, tgId, index) => {
      if (index === tgIds.length - 1) return `${acc} (${userId}, ${tgId});`;
      return `${acc} (${userId}, ${tgId}),`;
    }, `INSERT INTO user_talkgroup_maps (user_id, talkgroup_id) VALUES`);

  return query(sql);
};

const mapControlStations = (controlIds, userId) => {
  const sql = controlIds.reduce((acc, controlId, index) => {
    if (index === controlIds.length - 1)
      return `${acc} (${userId}, ${controlId});`;
    return `${acc} (${userId}, ${controlId}),`;
  }, `INSERT INTO dispatcher_control_maps (dispatcher_id, control_id) VALUES`);
  return query(sql);
};

const updateUser = (password, displayName, userId) => {
  const sql = `UPDATE users SET password='${password}', display_name='${displayName}' WHERE id=${userId}`;
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

const deleteDispatcherControlMaps = (userId) => {
  const sql = `DELETE FROM dispatcher_control_maps WHERE dispatcher_id=${userId};`;
  return query(sql);
};

const getCSUserById = (id) => {
  const sql = `SELECT id, display_name FROM control_station_user WHERE id=${id};`;
  return query(sql);
};

const createCSUser = (
  {
    ip_address: ipAddress,
    port,
    display_name: displayName,
    device_id: deviceId,
    rec_port: recPort,
    contact_no: contactNo,
    cs_type_id: csTypeId,
  },
  companyId
) => {
  const sql = `INSERT INTO control_station_user (remote_ip_address, remote_port, display_name, device_id, receiving_port, contact_no, cs_type_id,company_id) VALUES
               ('${ipAddress}', ${port}, '${displayName}', '${deviceId}', ${recPort}, '${contactNo}', ${csTypeId},${companyId});`;
  return query(sql);
};

const getCSUserByName = (displayName) => {
  const sql = `SELECT id FROM control_station_user WHERE display_name='${displayName}';`;
  return query(sql);
};

const updateCSUser = (
  {
    ip_address: ipAddress,
    port,
    display_name: displayName,
    device_id: deviceId,
    contact_no: contactNo,
    cs_type_id: csTypeId,
  },
  userId
) => {
  const sql = `UPDATE control_station_user SET remote_ip_address='${ipAddress}', remote_port=${port}, display_name='${displayName}', 
               device_id='${deviceId}', cs_type_id=${csTypeId}, contact_no='${contactNo}'
               WHERE id=${userId}`;
  return query(sql);
};

const changeStatusForAllUsers = (status, companyId) => {
  const sql1 = `UPDATE users SET status='${status}' WHERE company_id = ${companyId};`;
  const sql2 = `UPDATE control_station_user SET status='${status}' WHERE company_id = (${companyId});`;
  return [query(sql1), query(sql2)];
};

const getOrderIdForUsers = (companyId) => {
  const sql = `SELECT l.order_id, o.license_expiry, o.license_type, o.company_id FROM licenses l
               JOIN orders o ON l.order_id = o.id
               GROUP BY order_id 
               HAVING COUNT(user_id) < COUNT(l.id) AND o.company_id=${companyId};`;
  return query(sql);
};

const getControlStations = (companyId) => {
  const sql = `SELECT id, display_name FROM control_station_user WHERE company_id = ${companyId};`;
  return query(sql);
};

const getReceivingPort = (basePort, formType) => {
  let sql;
  if (formType === 'create')
    sql = `SELECT IF(MAX(receiving_port) < ${basePort}, ${basePort}, 
           MAX(receiving_port)+1 ) AS receivingPort FROM control_station_user;`;
  else
    sql = `SELECT receiving_port AS receivingPort FROM control_station_user 
           WHERE id=(
             SELECT user_id FROM licenses WHERE order_id=6
           );`;
  return query(sql);
};

const getControlStationTypes = (comapnyId) => {
  const sql = `SELECT id, name FROM control_station_types WHERE company_id=${comapnyId};`;
  return query(sql);
};

const getDataForUserModify = (companyId) => {
  const sql = `SELECT u.id, u.display_name, u.user_type, l.order_id 
              FROM users u
               JOIN licenses l ON l.user_id = u.id
               JOIN (SELECT id, license_type FROM orders) AS o ON l.order_id = o.id
               WHERE company_id = ${companyId} AND o.license_type = u.user_type
               UNION ALL
               SELECT u.id, u.display_name, 'control' AS user_type, l.order_id
               FROM control_station_user u
               JOIN licenses l ON l.user_id = u.id
               JOIN (SELECT id, license_type FROM orders) AS o ON l.order_id = o.id
               WHERE company_id = ${companyId} AND o.license_type = 'control';`;
  return query(sql);
};

const getPostFixNumber = (usernamePrefix) => {
  const sql = `SELECT username AS topOccurance FROM users WHERE id = (
                 SELECT MAX(id) FROM users WHERE username REGEXP '^${usernamePrefix}'
               );`;
  return query(sql);
};

const getCSPostFixNumber = (displayNamePrefix) => {
  const sql = `SELECT display_name AS topOccurance FROM control_station_user WHERE id = (
                 SELECT MAX(id) FROM control_station_user WHERE display_name REGEXP '^${displayNamePrefix}'
               );`;
  return query(sql);
};

const createBulkPttUsers = (
  postfixNumber,
  qty,
  usernamePrefix,
  password,
  displayNamePrefix,
  companyId,
  tgIds,
  defTg,
  licenseIds,
  {
    grp_call: grpCall,
    enc,
    priv_call: privCall,
    live_gps: liveGps,
    geo_fence: geoFence,
    chat,
  },
  contactNumber,
  contactListId
) => {
  const sql = Array(qty)
    .fill(usernamePrefix)
    .reduce((acc, val, index) => {
      const userId = `(SELECT id FROM users WHERE username='${val}${
        postfixNumber + index
      }')`;

      return `${acc} INSERT INTO users (user_type, username, password, display_name, company_id) 
              VALUES ('ptt', '${val}${postfixNumber + index}', 
             '${password}', 
             '${displayNamePrefix}${postfixNumber + index}', 
              ${companyId});

              INSERT INTO users_add_data (contact_no, contact_list_id, user_id) VALUES
              ('${contactNumber}', ${contactListId}, ${userId});

              INSERT INTO user_features (grp_call, enc, priv_call, live_gps, geo_fence, chat, user_id)
              VALUES (${grpCall}, ${enc}, ${privCall}, ${liveGps}, ${geoFence}, ${chat}, ${userId});

              UPDATE licenses SET user_id=${userId}
              WHERE id=${licenseIds[index]};

              ${talkgroupMap(tgIds, defTg, userId)}`;
    }, ``);

  return query(sql);
};

const createBulkDispatcherUsers = (
  postfixNumber,
  qty,
  usernamePrefix,
  password,
  displayNamePrefix,
  companyId,
  tgIds,
  defTg,
  licenseIds,
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
  controlIds
) => {
  const sql = Array(qty)
    .fill(usernamePrefix)
    .reduce((acc, val, index) => {
      const userId = `(SELECT id FROM users WHERE username='${val}${
        postfixNumber + index
      }')`;

      return `${acc} INSERT INTO users (user_type, username, password, display_name, company_id) 
              VALUES ('dispatcher', '${val}${postfixNumber + index}', 
             '${password}', 
             '${displayNamePrefix}${postfixNumber + index}', 
              ${companyId});

              INSERT INTO users_add_data (contact_no, contact_list_id, user_id) VALUES
              ('${contactNumber}', ${contactListId}, ${userId});

              INSERT INTO user_features (grp_call, enc, priv_call, live_gps, geo_fence, chat, user_id)
              VALUES (${grpCall}, ${enc}, ${privCall}, ${liveGps}, ${geoFence}, ${chat}, ${userId});

              UPDATE licenses SET user_id=${userId}
              WHERE id=${licenseIds[index]};

              ${talkgroupMap(tgIds, defTg, userId)}
              
              ${controlStationMap(controlIds, userId)}`;
    }, ``);

  return query(sql);
};

const createBulkControlStationUsers = (
  postfixNumber,
  qty,
  displayNamePrefix,
  contactNo,
  csTypeId,
  companyId,
  receivingPort
) => {
  const sql = Array(qty)
    .fill(displayNamePrefix)
    .reduce(
      (acc, val, index) =>
        `${acc} INSERT INTO control_station_user (display_name, receiving_port, cs_type_id, contact_no, company_id)
            VALUES ('${val}${postfixNumber + index}', ${
          receivingPort + index
        }, ${csTypeId}, '${contactNo}', ${companyId});`,
      ``
    );

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
  getCSUserById,
  createCSUser,
  getCSUserByName,
  updateCSUser,
  deleteDispatcherControlMaps,
  viewUsersCompanyPanel,
  changeStatusForAllUsers,
  getOrderIdForUsers,
  getControlStations,
  getReceivingPort,
  getControlStationTypes,
  getDataForUserModify,
  getPostFixNumber,
  getCSPostFixNumber,
  createBulkPttUsers,
  createBulkDispatcherUsers,
  createBulkControlStationUsers,
  CSupdateLicense,
};
