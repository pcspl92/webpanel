const express = require('express');

const router = express.Router();

// @route   GET api/subagent/
// @desc    Testing route
// @access  Public
router.get('/', (req, res) => {
  const user = 'hello';
  return res.status(200).json({ test: user });
});

module.exports = router;
