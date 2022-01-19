const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { agentSubAgentCheck, companyCheck, isLoggedIn } = require('../guard');
const { getSubAgents } = require('../queries/agent');
const {
  getUsersAgentPanel,
  getPttUsers,
  findUserByUsername,
  createPttUser,
  createPttUserAddData,
  mapPttUserTalkgroup,
  updateLicense,
} = require('../queries/user');
const { createCompanyActivityLog } = require('../queries/company');
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
    const user = `Helllo User`;
    return res.status(200).json(user);
  }
);

// @route   GET api/user/ptt
// @desc    PTT user fetching route
// @access  Private(Company)
router.get(
  '/ptt',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    // working
    const users = await getPttUsers(req.user.id);
    return res.status(200).send(users);
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

    const password = await hashPassword(req.body.password);
    const { insertId } = await createPttUser(
      req.body.username,
      password,
      req.body.display_name,
      req.body.dept_id
    );
    await updateLicense(req.body.license_id, insertId);
    await Promise.all(
      createPttUserAddData(
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
    await mapPttUserTalkgroup(req.body.tg_ids, req.body.def_tg, insertId);
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
    // working
    const users = `Dispatcher user creation route`;
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
    // working
    const users = `Control Station user creation route`;
    await createCompanyActivityLog('Control Station User Create', req.user.id);
    return res.status(201).send('created');
  }
);

module.exports = router;
