const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');

const companyCheck = require('../guard/company');
const { findDeptByUsername, createDept } = require('../queries/department');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   POST api/department/
// @desc    Department creation route
// @access  Private(Company)
router.post('/', guard.check('company'), companyCheck, async (req, res) => {
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
  return res.status(201).send('created');
});

module.exports = router;
