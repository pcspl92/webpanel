const express = require('express');
const guard = require('express-jwt-permissions')();

const {
  findAgent,
  findAgentById,
  createAgent,
  addAgentdetials,
  addPriceDetails,
  updatePriceDetails,
  getAgentBalance,
  rechargeSubAgent,
  updateSubAgent,
} = require('../queries/agent');
const { agentCheck } = require('../guard');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   POST api/subagent/
// @desc    Subagent creation route
// @access  Private(Agent)
router.post('/', guard.check('agent'), agentCheck, async (req, res) => {
  const agent = await findAgent(req.body.username);
  if (agent.length)
    return res
      .status(400)
      .json({ username: 'Sub-Agent with given username already exists' });

  const password = await hashPassword(req.body.password);

  const result = await createAgent(
    req.body.username,
    password,
    req.body.display_name,
    'subagent',
    req.user.id
  );
  await addAgentdetials(
    req.body.balance,
    req.body.contact_number,
    result.insertId
  );
  await addPriceDetails(
    req.body.ptt.monthly,
    req.body.ptt.quarterly,
    req.body.ptt.half_yearly,
    req.body.ptt.yearly,
    req.body.ptt.one_time,
    req.body.dispatcher.monthly,
    req.body.dispatcher.quarterly,
    req.body.dispatcher.half_yearly,
    req.body.dispatcher.yearly,
    req.body.dispatcher.one_time,
    req.body.control.monthly,
    req.body.control.quarterly,
    req.body.control.half_yearly,
    req.body.control.yearly,
    req.body.control.one_time,
    result.insertId
  );

  return res.status(201).send('created');
});

// @route   PUT api/subagent/:id
// @desc    Subagent updation route
// @access  Private(Agent)
router.put('/:id', guard.check('agent'), agentCheck, async (req, res) => {
  const agent = await findAgentById(req.params.id);
  if (!agent.length)
    return res
      .status(404)
      .json({ subagent: 'Sub-Agent with given id is not registered' });

  const password = await hashPassword(req.body.password);
  await Promise.all(
    updateSubAgent(
      req.body.display_name,
      req.body.contact_number,
      password,
      req.params.id
    )
  );
  return res.status(200).send('updated');
});

// @route   PUT api/subagent/:id/recharge
// @desc    Subagent recharge route
// @access  Private(Agent)
router.put(
  '/:id/recharge',
  guard.check('agent'),
  agentCheck,
  async (req, res) => {
    const agent = await findAgentById(req.params.id);
    if (!agent.length)
      return res
        .status(404)
        .json({ subagent: 'Sub-Agent with given id is not registered' });

    const [{ balance }] = await getAgentBalance(req.user.id);
    if (req.body.amount > balance)
      return res.status(400).json({
        amount: `Your available balance is ${balance}, please choose amount below ${balance}`,
      });

    await Promise.all(
      rechargeSubAgent(req.params.id, req.user.id, req.body.amount)
    );
    return res.status(200).send('updated');
  }
);

// @route   PUT api/subagent/:id/prices
// @desc    Subagent price updation route
// @access  Private(Agent)
router.put(
  '/:id/prices',
  guard.check('agent'),
  agentCheck,
  async (req, res) => {
    const agent = await findAgentById(req.params.id);
    if (!agent.length)
      return res
        .status(404)
        .json({ subagent: 'Sub-Agent with given id is not registered' });

    await Promise.all(
      updatePriceDetails(
        req.body.ptt.monthly,
        req.body.ptt.quarterly,
        req.body.ptt.half_yearly,
        req.body.ptt.yearly,
        req.body.ptt.one_time,
        req.body.dispatcher.monthly,
        req.body.dispatcher.quarterly,
        req.body.dispatcher.half_yearly,
        req.body.dispatcher.yearly,
        req.body.dispatcher.one_time,
        req.body.control.monthly,
        req.body.control.quarterly,
        req.body.control.half_yearly,
        req.body.control.yearly,
        req.body.control.one_time,
        req.params.id
      )
    );

    return res.status(200).send('updated');
  }
);

module.exports = router;
