const express = require('express');
const guard = require('express-jwt-permissions')();

const { companyCheck, isLoggedIn } = require('../guard');
const {
  findTGByName,
  findTGById,
  getTGs,
  createTG,
  updateTG,
  TGid,
  deleteTG,
  deleteTGMap,
} = require('../queries/talkgroup');
const { createCompanyActivityLog } = require('../queries/company');

const router = express.Router();

// @route   GET api/talkgroup/
// @desc    Talkgroup fetching route
// @access  Private(Company)
router.get(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const talkgroups = await getTGs(req.user.id);
    return res.status(200).json(talkgroups);
  }
);
router.get(
  '/gettalkgroupid',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const [tgid] = await TGid();
    console.log(tgid);
    return res.status(200).json(tgid);
  }
);
// @route   POST api/talkgroup/
// @desc    Talkgroup creation route
// @access  Private(Company)

router.post(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    console.log(req.body)
    const tg = await findTGByName(req.body.name,req.user.id);
    console.log(tg.length)
    if (tg.length>0)
    {
      console.log("Bey")
      return res
        .status(200)
        .send({ message: 'Talkgroup with given name already exists' });
    }
    else{
      console.log("Bie")
      await createTG(req.body.name, req.user.id);
      await createCompanyActivityLog('Talk-Group Create', req.user.id);
      return res.status(201).send({ message: 'Talkgroup has been created' });
    }
  }
);

// @route   PUT api/talkgroup/:id
// @desc    Talkgroup updation route
// @access  Private(Company)
router.delete(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let tg = await findTGById(req.params.id);
    if (!tg.length)
      return res
        .status(404)
        .json({ talkgroup: 'Talkgroup with given id is not registered.' });

    tg = await findTGByName(req.body.name);
    if (tg.length)
      return res
        .status(400)
        .json({ talkgroup: 'Talkgroup with given name already exists.' });

    await deleteTGMap(req.params.id);
    await deleteTG(req.params.id);
    await createCompanyActivityLog('Talk-Group Modify', req.user.id);
    return res.status(200).send({ message: 'Talkgroup has been delete' });
  }
);
router.put(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let tg = await findTGById(req.params.id);
    if (!tg.length)
      return res
        .status(404)
        .json({ talkgroup: 'Talkgroup with given id is not registered.' });

    tg = await findTGByName(req.body.name);
    if (tg.length)
      return res
        .status(400)
        .json({ talkgroup: 'Talkgroup with given name already exists.' });

    await updateTG(req.body.name, req.params.id);
    await createCompanyActivityLog('Talk-Group Modify', req.user.id);
    return res.status(200).send({ message: 'Talkgroup has been updated' });
  }
);

module.exports = router;
