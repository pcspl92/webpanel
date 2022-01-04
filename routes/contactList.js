const express = require('express');
const guard = require('express-jwt-permissions')();

const { companyCheck } = require('../guard');
const {
  getContactListByName,
  getContactListById,
  getContactListJoined,
  createContactList,
  updateContactList,
  deleteContactList,
} = require('../queries/contactList');

const router = express.Router();

// @route   GET api/contactlist/:id
// @desc    Contact-List fetching route
// @access  Private(Company)
router.get('/:id', guard.check('company'), companyCheck, async (req, res) => {
  let list = await getContactListById(req.params.id);
  if (!list.length)
    return res
      .status(404)
      .json({ contactlist: 'No Contact List with given id found.' });

  list = await getContactListJoined(req.params.id);
  return res.status(200).json(list);
});

// @route   POST api/contactlist/
// @desc    Contact-List creation route
// @access  Private(Company)
router.post('/', guard.check('company'), companyCheck, async (req, res) => {
  const list = await getContactListByName(req.body.name);
  if (list.length)
    return res
      .status(400)
      .json({ contactList: 'Contact List with given name already exists.' });

  await createContactList(req.body.name, req.user.id, req.body.userIds);
  return res.status(201).send('created');
});

// @route   PUT api/contactlist/:id
// @desc    Contact-List updation route
// @access  Private(Company)
router.put('/:id', guard.check('company'), companyCheck, async (req, res) => {
  let list = await getContactListById(req.params.id);
  if (!list.length)
    return res
      .status(404)
      .json({ contactlist: 'No Contact List with given id found.' });

  list = await getContactListByName(req.body.name);
  if (!list.length)
    return res
      .status(404)
      .json({ contactlist: 'Contact List with given name already exists.' });

  await updateContactList(req.params.id, req.body.name, req.body.userIds);
  return res.status(200).send('updated');
});

// @route   DELETE api/contactlist/:id
// @desc    Contact-List deletion route
// @access  Private(Company)
router.delete(
  '/:id',
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const list = await getContactListById(req.params.id);
    if (!list.length)
      return res
        .status(404)
        .json({ contactlist: 'No Contact List with given id found.' });

    await deleteContactList(req.params.id);
    return res.status(200).send('deleted');
  }
);

module.exports = router;
