const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');
const moment = require('moment');

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const { getSubAgents } = require('../queries/agent');
const {
  getUsersAgentPanel,
  getUsers,
  findUserByUsername,
  createUser,
  createUserAddData,
  mapUserTalkgroup,
  updateLicense,
  CSupdateLicense,
  mapControlStations,
  findUserById,
  updateUser,
  updateUserAddData,
  deleteUserTalkgroupMaps,
  createCSUser,
  getCSUserByName,
  updateCSUser,
  getCSUserById,
  deleteDispatcherControlMaps,
  viewUsersCompanyPanel,
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
  getContactNumById,
  getControlId,
  getContactListByuserId,
  getCSUserDataById,
} = require('../queries/user');
const { createCompanyActivityLog } = require('../queries/company');
const { getTGs,getTGmap } = require('../queries/talkgroup');
const { getContactLists } = require('../queries/contactlist');
const { getFeatures, getLicenseIds, getLicenses, getFeaturesByUserId } = require('../queries/order');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   GET api/user/agent-panel
// @desc    User view route for agent panel
// @access  Private(Agent|Subagent)
router.get(
  '/agent-panel',
  isLoggedIn,
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const result = await getSubAgents(req.user.id);
    const agentIds = result.reduce(
      (acc, sub) => [...acc, sub.id],
      [req.user.id]
    );

    const userData = await getUsersAgentPanel(agentIds);
    //console.log(userData);
    return res.status(200).json(userData);
  }
);

// @route   GET api/user/company-panel
// @desc    User view route for company panel
// @access  Private(Company)
router.get(
  '/company-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    const userData = await viewUsersCompanyPanel(req.user.id, currDate);
    return res.status(200).json(userData);
  }
);

// @route   GET api/user/company-panel/user-create
// @desc    User Create Form drop-down data fetching route
// @access  Private(Company)
router.get(
  '/company-panel/user-create',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const users = await getOrderIdForUsers(req.user.id);
    return res.status(200).json({ users });
  }
);

// @route   GET api/user/company-panel/user-modify
// @desc    User Modify Form drop-down data fetching route
// @access  Private(Company)
router.get(
  '/company-panel/user-modify',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const users = await getDataForUserModify(req.user.id);
    return res.status(200).json({ users });
  }
);

// @route   GET api/user/:type
// @desc    User fetching route for given type
// @access  Private(Company)
router.get(
  '/:type',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const users = await getUsers(req.user.id, req.params.type);
    return res.status(200).send(users);
  }
);

router.get(
  '/:formType/:type/:orderId/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let data = {};

    const getPttFormData = async () => {
      const [tgs, cls, [features],ctnNum,talgroups_map,userContactList,userFeatures] = await Promise.all([
        getTGs(req.user.id),
        getContactLists(req.user.id),
        getFeatures(req.params.orderId),
        getContactNumById(req.params.id),
        getTGmap(req.params.id),
        getContactListByuserId(req.params.id),
        getFeaturesByUserId(req.params.id),
      ]);
      return { tgs, cls, features,ctnNum,talgroups_map,userContactList, userFeatures };
    };

    const getDisaptcherFormData = async () => {
      const [tgs, cls, [features], controlStations,ctnNum,talgroups_map,controlId,userContactList, userFeatures] = await Promise.all([
        getTGs(req.user.id),
        getContactLists(req.user.id),
        getFeatures(req.params.orderId),
        getControlStations(req.user.id),
        getContactNumById(req.params.id),
        getTGmap(req.params.id),
        getControlId(req.params.id),
        getContactListByuserId(req.params.id),
        getFeaturesByUserId(req.params.id),
      ]);
      return { tgs, cls, features, controlStations,ctnNum,talgroups_map,controlId,userContactList, userFeatures };
    };

    const getControlFormData = async () => {
      const receivingPortBase = 8080;
      const [[{ receivingPort }], csTypes,ctnNum,userdata] = await Promise.all([
        getReceivingPort(receivingPortBase, req.params.formType),
        getControlStationTypes(1),
        getContactNumById(req.params.id),
        getCSUserDataById(req.params.id),
      ]);
      return { receivingPort, csTypes, ctnNum, userdata};
    };

    switch (req.params.type) {
      case 'ptt':
        data = await getPttFormData();
        break;
      case 'dispatcher':
        data = await getDisaptcherFormData();
        break;
      case 'control':
        data = await getControlFormData();
        break;
      default:
        break;
    }
    return res.status(200).json(data);
  }
);

// @route   POST api/user/ptt
// @desc    PTT user creation route
// @access  Private(Company)
router.post(
'/ptt',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = await findUserByUsername(req.body.username);
    if (user.length)
      return res
        .status(400)
        .json({ user: 'User with given username is already registered.' });
  
    const [{ id: licenseId }] = await getLicenseIds(req.body.order_id, 2);
    console.log(licenseId);
    const password = await hashPassword(req.body.password);
    const { insertId } = await createUser(
      'ptt',
      req.body.username,
      password,
      req.body.display_name,
      req.user.id
    );
    await updateLicense(licenseId, insertId);
    await Promise.all(
      createUserAddData(
        _.pick(req.body.features, [
          'grp_call',
          'enc',
          'priv_call',
          'live_gps',
          'geo_fence',
          'chat',
        ]),
        req.body.contact_number,
        req.body.contact_list_id,
        insertId
      )
    );
    if (req.body.tg_ids.length) await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, insertId);

    await createCompanyActivityLog('PTT User Create', req.user.id);
    return res.status(201).send({ message: 'PTT User has been created' });
  }
);

// @route   POST api/user/dispatcher
// @desc    Dispatcher user creation route
// @access  Private(Company)
router.post(
  '/dispatcher',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {

    const user = await findUserByUsername(req.body.username);
    if (user.length)
      return res
        .status(400)
        .json({ user: 'User with given username is already registered.' });

    const [{ id: licenseId }] = await getLicenseIds(req.body.order_id, 1);
    const password = await hashPassword(req.body.password);
    const { insertId } = await createUser(
      'dispatcher',
      req.body.username,
      password,
      req.body.display_name,
      req.user.id
    );
    await updateLicense(licenseId, insertId);
    await Promise.all(
      createUserAddData(
        _.pick(req.body.features, [
          'grp_call',
          'enc',
          'priv_call',
          'live_gps',
          'geo_fence',
          'chat',
        ]),
        req.body.contact_number,
        req.body.contact_list_id,
        insertId
      )
    );
    if (req.body.tg_ids.length)
      await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, insertId);
    if (req.body.control_ids.length)
      await mapControlStations(req.body.control_ids, insertId);
    await createCompanyActivityLog('Dispatcher User Create', req.user.id);
    return res
      .status(201)
      .send({ message: 'Dispatcher User has been created' });
  }
);

// @route   POST api/user/control
// @desc    Control Station user creation route
// @access  Private(Company)
router.post(
  '/control',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = await getCSUserByName(req.body.display_name);
    if (user.length)
      return res.status(400).json({
        user: 'Control Station with given name alreay exists.',
      });

    const [{ id: licenseId }] = await getLicenseIds(req.body.order_id, 1);
    const { insertId } = await createCSUser(
      _.pick(req.body, [
        'ip_address',
        'port',
        'display_name',
        'device_id',
        'rec_port',
        'contact_no',
        'cs_type_id',
      ]),
      req.user.id
    );
    await updateLicense(licenseId, insertId);
    await CSupdateLicense(licenseId, insertId);
    await createCompanyActivityLog('Control Station User Create', req.user.id);
    return res
      .status(201)
      .send({ message: 'Control Station User has been created' });
  }
);

// @route   PUT api/user/ptt/:id
// @desc    PTT user updation route
// @access  Private(Company)
router.put(
  '/ptt/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = await findUserById(req.params.id, 'ptt');
    if (!user.length)
      return res.status(400).json({
        user: 'Eihter user is not registered with given id or the user is not PTT user.',
      });

    const password = await hashPassword(req.body.password);
    await updateUser(password, req.body.display_name, req.params.id);
    await Promise.all(
      updateUserAddData(
        _.pick(req.body.features, [
          'grp_call',
          'enc',
          'priv_call',
          'live_gps',
          'geo_fence',
          'chat',
        ]),
        req.body.contact_number,
        req.body.contact_list_id,
        req.params.id
      )
    );
    await deleteUserTalkgroupMaps(req.params.id);
    if (req.body.tg_ids.length)  await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, req.params.id);
    await createCompanyActivityLog('PTT User Modify', req.user.id);
    return res.status(200).send({ message: 'PTT User has been  Updated' });
  }
);

// @route   PUT api/user/dispatcher/:id
// @desc    Dispatcher user updation route
// @access  Private(Company)
router.put(
  '/dispatcher/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const user = await findUserById(req.params.id, 'dispatcher');
    if (!user.length)
      return res.status(400).json({
        user: 'Eihter user is not registered with given id or the user is not Dispatcher user.',
      });

    const password = await hashPassword(req.body.password);
    await updateUser(password, req.body.display_name, req.params.id);
    await Promise.all(
      updateUserAddData(
        _.pick(req.body.features, [
          'grp_call',
          'enc',
          'priv_call',
          'live_gps',
          'geo_fence',
          'chat',
        ]),
        req.body.contact_number,
        req.body.contact_list_id,
        req.params.id
      )
    );
    await deleteUserTalkgroupMaps(req.params.id);
    if (req.body.tg_ids.length)await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, req.params.id);
    if (req.body.control_ids.length) {
      await deleteDispatcherControlMaps(req.params.id);
      await mapControlStations(req.body.control_ids, req.params.id);
    }
    await createCompanyActivityLog('Dispatcher User Modify', req.user.id);
    return res.status(200).send({ message: 'Dipatcher User has been modified' });
  }
);

// @route   PUT api/user/control/:id
// @desc    Control Station user updation route
// @access  Private(Company)
router.put(
  '/control/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let user = await getCSUserById(req.params.id);
    if (!user.length)
      return res.status(400).json({
        user: 'Control Station user with given id is not registered.',
      });

    if (
      req.body.display_name.toLowerCase() !== user[0].display_name.toLowerCase()
    ) {
      user = await getCSUserByName(req.body.display_name);
      if (user.length)
        return res(400).json({
          user: 'Control Station with given name alreay exists.',
        });
    }

    await updateCSUser(
      _.pick(req.body, [
        'ip_address',
        'port',
        'display_name',
        'device_id',
        'contact_no',
        'cs_type_id',
      ]),
      req.params.id
    );
    await createCompanyActivityLog('Control Station User Modify', req.user.id);
    return res
      .status(200)
      .send({ message: 'Control Station User has been updated' });
  }
);

// @route   POST api/user/bulk/ptt
// @desc    Bulk PTT user creation route
// @access  Private(Company)
router.post(
  '/bulk/ptt',
  isLoggedIn,
  guard.check('company'),
  async (req, res) => {
    const result = await getPostFixNumber(req.body.username_prefix);
    if (result.length) {
      const nextPostfix =
        +result[0].topOccurance.split(req.body.username_prefix)[1] + 1;
      if (req.body.postfix_number < nextPostfix)
        return res.status(400).json({
          user: `Postfix number should be greater than or eqaul to ${nextPostfix}.`,
        });
    }

    const licenses = await getLicenses(req.body.order_id);
    const licenseIds = licenses.reduce((acc, val) => [...acc, val.id], []);
    if (req.body.qty > licenseIds.length)
      return res.status(400).json({
        user: `You can create at most ${licenseIds.length} user accounts from selected order.`,
      });

    const password = await hashPassword(req.body.password);

    await createBulkPttUsers(
      req.body.postfix_number,
      req.body.qty,
      req.body.username_prefix,
      password,
      req.body.display_name_prefix,
      req.user.id,
      req.body.tg_ids,
      req.body.def_tg,
      licenseIds,
      _.pick(req.body.features, [
        'grp_call',
        'enc',
        'priv_call',
        'live_gps',
        'geo_fence',
        'chat',
      ]),
      req.body.contact_number,
      req.body.contact_list_id
    );
    await createCompanyActivityLog('PTT User Create', req.user.id);
    return res.status(201).send({ message: 'PTT Users have been created' });
  }
);

// @route   POST api/user/bulk/dispatcher
// @desc    Bulk Dispatcher user creation route
// @access  Private(Company)
router.post(
  '/bulk/dispatcher',
  isLoggedIn,
  guard.check('company'),
  async (req, res) => {
    const result = await getPostFixNumber(req.body.username_prefix);
    if (result.length) {
      const nextPostfix =
        +result[0].topOccurance.split(req.body.username_prefix)[1] + 1;
      if (req.body.postfix_number < nextPostfix)
        return res.status(400).json({
          user: `Postfix number should be greater than or eqaul to ${nextPostfix}.`,
        });
    }

    const licenses = await getLicenses(req.body.order_id);
    const licenseIds = licenses.reduce((acc, val) => [...acc, val.id], []);
    if (req.body.qty > licenseIds.length)
      return res.status(400).json({
        user: `You can create at most ${licenseIds.length} user accounts from selected order.`,
      });

    const password = await hashPassword(req.body.password);

    await createBulkDispatcherUsers(
      req.body.postfix_number,
      req.body.qty,
      req.body.username_prefix,
      password,
      req.body.display_name_prefix,
      req.user.id,
      req.body.tg_ids,
      req.body.def_tg,
      licenseIds,
      _.pick(req.body.features, [
        'grp_call',
        'enc',
        'priv_call',
        'live_gps',
        'geo_fence',
        'chat',
      ]),
      req.body.contact_number,
      req.body.contact_list_id,
      req.body.control_ids
    );
    await createCompanyActivityLog('Dispatcher User Create', req.user.id);
    return res
      .status(201)
      .send({ message: 'Dispatcher Users have been created' });
  }
);

// @route   POST api/user/bulk/control
// @desc    Bulk Control Station user creation route
// @access  Private(Company)
router.post(
  '/bulk/control',
  isLoggedIn,
  guard.check('company'),
  async (req, res) => {
    const result = await getCSPostFixNumber(req.body.display_name_prefix);
    if (result.length) {
      const nextPostfix =
        +result[0].topOccurance.split(req.body.display_name_prefix)[1] + 1;
      if (req.body.postfix_number < nextPostfix)
        return res.status(400).json({
          user: `Postfix number should be greater than or eqaul to ${nextPostfix}.`,
        });
    }

    const licenses = await getLicenses(req.body.order_id);
    const licenseIds = licenses.reduce((acc, val) => [...acc, val.id], []);
    if (req.body.qty > licenseIds.length)
      return res.status(400).json({
        user: `You can create at most ${licenseIds.length} user accounts from selected order.`,
      });

    await createBulkControlStationUsers(
      req.body.postfix_number,
      req.body.qty,
      req.body.display_name_prefix,
      req.body.contact_number,
      req.body.cs_type_id,
      req.user.id,
      req.body.receiving_port
    );

    await createCompanyActivityLog('Control Station User Create', req.user.id);
    return res
      .status(201)
      .send({ message: 'Control Station Users have been created' });
  }
);

module.exports = router;
