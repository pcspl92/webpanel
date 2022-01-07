const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const { companyCheck, isLoggedIn } = require('../guard');
const {
  findDeptByUsername,
  createDept,
  updatedepartment,
} = require('../queries/department');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

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
      ..._.pick(req.body, ['username', 'displayName']),
      password,
      companyId: req.user.id,
    };

    await createDept(data);
    return res.status(201).send('created');
  }
);

router.put(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    await updatedepartment(req.body.newname, req.body.newpassword);
    return res.status(201).send('department updated');
  }
);
module.exports = router;
