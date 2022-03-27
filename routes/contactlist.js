const express = require('express');
const guard = require('express-jwt-permissions')();

const { companyCheck, isLoggedIn } = require('../guard');
const {
  getContactListByName,
  getContactListById,
  createContactList,
  updateContactList,
  deleteContactList,
  getContactLists,
  createUserContactListMaps,
  deleteUserContactListMaps,
  CLid,
} = require('../queries/contactlist');
const { createCompanyActivityLog } = require('../queries/company');

const router = express.Router();

// @route   GET api/contactlist/
// @desc    Contact-List fetching route
// @access  Private(Company)
router.get(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const list = await getContactLists(req.user.id);
    return res.status(200).json(list);
  }
);
router.get(
  '/getclid',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const [clid] = await CLid();
    console.log(clid);
    return res.status(200).json(clid);
  }
);
// @route   POST api/contactlist/
// @desc    Contact-List creation route
// @access  Private(Company)
router.post(
  '/',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const list = await getContactListByName(req.body.name);
    if (list.length)
      return res
        .status(400)
        .json({ contactList: 'Contact List with given name already exists.' });

    const { insertId } = await createContactList(req.body.name, req.user.id);
    if (req.body.userIds.length)
      await createUserContactListMaps(insertId, req.body.userIds);
    await createCompanyActivityLog('Contact-List Create', req.user.id);
    return res.status(201).send({ message: 'Contact List has been created' });
  }
);

// @route   PUT api/contactlist/:id
// @desc    Contact-List updation route
// @access  Private(Company)
router.put(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    let list = await getContactListById(req.params.id);
    if (!list.length)
      return res
        .status(404)
        .json({ contactlist: 'No Contact List with given id found.' });

    list = await getContactListByName(req.body.name);
    if (list.length)
      return res
        .status(404)
        .json({ contactlist: 'Contact List with given name already exists.' });

    await updateContactList(req.params.id, req.body.name);
    await deleteUserContactListMaps(req.params.id);
    if (req.body.userIds.length)
      await createUserContactListMaps(req.params.id, req.body.userIds);
    await createCompanyActivityLog('Contact-List Modify', req.user.id);
    return res.status(200).send({ message: 'Contact-List has been updated' });
  }
);

// @route   DELETE api/contactlist/:id
// @desc    Contact-List deletion route
// @access  Private(Company)
router.delete(
  '/:id',
  isLoggedIn,
  guard.check('company'),
  companyCheck,
  async (req, res) => {
    const list = await getContactListById(req.params.id);
    if (!list.length)
      return res
        .status(404)
        .json({ contactlist: 'No Contact List with given id found.' });

    await deleteContactList(req.params.id);
    await deleteUserContactListMaps(req.params.id);

    await createCompanyActivityLog('Contact-List Delete', req.user.id);
    return res.status(200).send({ message: 'Contact-List has been Deleted' });
  }
);

module.exports = router;
