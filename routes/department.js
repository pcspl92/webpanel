const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { companyCheck, isLoggedIn } = require('../guard');
const {
  findDeptByUsername,
  createDept,
  updateDept,
  findDeptById,
  deleteDept,
} = require('../queries/department');
const {
  getDepartments,
  createCompanyActivityLog,
} = require('../queries/company');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   GET api/department/
// @desc    All departments fetching route
// @access  Private(Company)
router.get(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const departments = await getDepartments(req.user.id);
    return res.status(200).json(departments);
  }
);

// @route   POST api/department/
// @desc    Department creation route
// @access  Private(Company)
router.post(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const dept = await findDeptByUsername(req.body.username);
    if (dept.length)
      return res
        .status(400)
        .json({ username: 'Department with given username already exists' });

    const password = await hashPassword(req.body.password);
    const data = {
      ..._.pick(req.body, ['username', 'display_name']),
      password,
      companyId: req.user.id,
    };

    await createDept(data);
    await createCompanyActivityLog('Department Create', req.user.id);
    return res.status(201).send('created');
  }
);

// @route   PUT api/department/:id
// @desc    Department updation route
// @access  Private(Company)
router.put(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let department = await findDeptById(req.params.id);
    if (!department.length)
      return res
        .status(404)
        .json({ department: 'Department with given id is not registered' });

    department = await findDeptByUsername(req.body.username);
    if (department.length)
      return res
        .status(400)
        .json({ username: 'Department with given username already exists' });

    const password = await hashPassword(req.body.password);

    await updateDept(password, req.body.display_name, req.params.id);
    await createCompanyActivityLog('Department Modify', req.user.id);
    return res.status(200).send('updated');
  }
);

// @route   DELETE api/department/:id
// @desc    Department deletion route
// @access  Private(Company)
router.delete(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const department = await findDeptById(req.params.id);
    if (!department.length)
      return res
        .status(404)
        .json({ department: 'Department with given id is not registered' });

    await deleteDept(req.params.id);
    await createCompanyActivityLog('Department Delete', req.user.id);
    return res.status(200).send('deleted');
  }
);

module.exports = router;
