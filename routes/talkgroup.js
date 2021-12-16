const express = require('express');
const guard = require('express-jwt-permissions')();

const companyCheck = require('../guard/company');
const { findTGByName, createTG } = require('../queries/talkgroup');

const router = express.Router();

// @route   POST api/talkgroup/
// @desc    Talkgroup creation route
// @access  Private(Company)
router.post('/', guard.check('company'), companyCheck, async (req, res) => {
  const tg = await findTGByName(req.body.name);
  if (tg.length)
    return res
      .status(400)
      .json({ username: 'Talkgroup with given name already exists' });

  await createTG({ tgName: req.body.name, companyId: req.user.id });
  return res.status(201).send('created');
});

module.exports = router;
