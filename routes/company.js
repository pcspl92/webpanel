const express = require('express');
const guard = require('express-jwt-permissions')();
const _ = require('lodash');
const companyCheck = require('../guard/company');

const agentSubAgentCheck = require('../guard/agentSubAgent');
const { findCompanyByUsername, createCompany ,findCompanies,updateCompany,fetchloglist} = require('../queries/company');
const { hashPassword } = require('../utils/bcrypt');

const router = express.Router();

// @route   POST api/company/
// @desc    Company creation route
// @access  Private(Agent|Subagent)
router.post(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanyByUsername(req.body.username);
    if (company.length)
      return res
        .status(400)
        .json({ username: 'Company with given username already exists' });

    const password = await hashPassword(req.body.password);
    const data = {
      ..._.pick(req.body, ['username', 'displayName', 'contactNumber']),
      password,
      agentId: req.user.id,
    };

    await createCompany(data);
    return res.status(201).send('created');
  }
);
router.get(
  '/',
  guard.check([['agent'], ['subagent']]),
  agentSubAgentCheck,
  async (req, res) => {
    const company = await findCompanies();
    if (!company.length)
      return res
        .status(400)
        .json({ username: 'No company exists' });

 

  const companylist=  await findCompanies();
    return res.status(201).send(companylist);
  }
);
router.put('/',  guard.check([['agent'], ['subagent']]),
agentSubAgentCheck,
async (req, res) => {
 

 

await updateCompany(req.body.newpassword,req.body.newcompanyname,req.body.newcontactnumber,req.body.newsubagent);
  return res.status(201).send('Company details updated');
});

router.post('/',
guard.check('company'), companyCheck,
async (req, res) => {
const loglist = await fetchloglist(req.body.agentid);
 
return res.status(201).send(loglist);

});

module.exports = router;
