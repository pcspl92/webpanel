const express = require('express');
const agentCheck = require('../guard/agent');

const router = express.Router();
const {
  findAgent,
  createAgent,
  addAgentdetials,
  addPriceDetails,

} = require('../queries/agent');
// @route   GET api/subagent/
// @desc    Testing route
// @access  Public
router.get('/', (req, res) => {
  const user = 'hello';
  return res.status(200).json({ test: user });
});
router.post('/',
guard.check([['agent']]),
agentCheck,
async (req, res) => {
const agent = await findAgent(req.body.username);
  if (agent.length)
    return res
      .status(400)
      .json({ username: 'Sub-Agent with given username already exists' });
 await createAgent(
    req.body.username,
    req.body.password,
    req.body.display_name,
    req.body.agent_type,
    req.body.agent_id
  );
  await addAgentdetials(
    req.body.balance,
    req.body.contact_number,
    req.body.agent_id,
    req.body.timestamp
  );
 await addPriceDetails(
    req.body.license_type,
    req.body.monthly,
    req.body.quarterly,
    req.body.half_yearly,
    req.body.yearly,
    req.body.one_time,
    req.body.agent_id,
    req.body.timestamp

  );
  return res.status(201).send('created');

});
module.exports = router;
