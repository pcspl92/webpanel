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
} = require('../queries/user');
const {
  createCompanyActivityLog,
  getDepartments,
} = require('../queries/company');
const { getTGs } = require('../queries/talkgroup');
const { getContactLists } = require('../queries/contactlist');
const { getFeatures, getLicenseIds } = require('../queries/order');
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
    const result = await getDepartments(req.user.id);
    const deptIds = result.reduce(
      (acc, sub) => [...acc, sub.id],
      [req.user.id]
    );
    const currDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    const userData = await viewUsersCompanyPanel(deptIds, currDate);
    return res.status(200).json(userData);
  }
);

// @route   GET api/user/company-panel/user-panel
// @desc    User fetching route for given type
// @access  Private(Company)
router.get(
  '/company-panel/user-panel',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const users = await getOrderIdForUsers(req.user.id);
    const departments = await getDepartments(req.user.id);
    return res.status(200).json({ users, departments });
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
    const depts = await getDepartments(req.user.id);
    const deptIds = depts.reduce((acc, dept) => [...acc, dept.id], []);
    const users = await getUsers(deptIds, req.params.type);
    return res.status(200).send(users);
  }
);
// @route   GET api/user/:type/:orderId
// @desc    User form data fetching route
// @access  Private(Company)
router.get(
  '/:type/:orderId',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let data = {};

    const getPttFormData = async () => {
      const [tgs, cls, [features]] = await Promise.all([
        getTGs(req.user.id),
        getContactLists(req.user.id),
        getFeatures(req.params.orderId),
      ]);
      return { tgs, cls, features };
    };

    const getDisaptcherFormData = async () => {
      const depts = await getDepartments(req.user.id);
      const deptIds = depts.reduce((acc, dept) => [...acc, dept.id], []);
      const [tgs, cls, [features], controlStations] = await Promise.all([
        getTGs(req.user.id),
        getContactLists(req.user.id),
        getFeatures(req.params.orderId),
        getControlStations(deptIds),
      ]);
      return { tgs, cls, features, controlStations };
    };

    const getControlFormData = async () => {
      const receivingPortBase = 8080;
      const [[{ receivingPort }], csTypes] = await Promise.all([
        getReceivingPort(receivingPortBase),
        getControlStationTypes(req.user.id),
      ]);
      return { receivingPort, csTypes };
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

    const [{ id: licenseId }] = await getLicenseIds(req.body.order_id, 1);
    const password = await hashPassword(req.body.password);
    const { insertId } = await createUser(
      'ptt',
      req.body.username,
      password,
      req.body.display_name,
      req.body.dept_id
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
    await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, insertId);
    await createCompanyActivityLog('PTT User Create', req.user.id);
    return res.status(201).send('created');
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
      req.body.dept_id
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
    await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, insertId);
    if (req.body.control_ids.length)
      await mapControlStations(req.body.control_ids, insertId);
    await createCompanyActivityLog('Dispatcher User Create', req.user.id);
    return res.status(201).send('created');
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
      return res(400).json({
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
        'dept_id',
      ])
    );
    await updateLicense(licenseId, insertId);
    await createCompanyActivityLog('Control Station User Create', req.user.id);
    return res.status(201).send('created');
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
    await updateUser(
      password,
      req.body.display_name,
      req.body.dept_id,
      req.params.id
    );
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
    await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, req.params.id);
    await createCompanyActivityLog('PTT User Modify', req.user.id);
    return res.status(200).send('updated');
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
    await updateUser(
      password,
      req.body.display_name,
      req.body.dept_id,
      req.params.id
    );
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
    await mapUserTalkgroup(req.body.tg_ids, req.body.def_tg, req.params.id);
    if (req.body.control_ids.length) {
      await deleteDispatcherControlMaps(req.params.id);
      await mapControlStations(req.body.control_ids, req.params.id);
    }
    await createCompanyActivityLog('Dispatcher User Modify', req.user.id);
    return res.status(200).send('updated');
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
        'rec_port',
        'contact_no',
        'cs_type_id',
        'dept_id',
      ])
    );
    await createCompanyActivityLog('Control Station User Modify', req.user.id);
    return res.status(200).send('updated');
  }
);

module.exports = router;
