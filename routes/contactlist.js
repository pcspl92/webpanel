const express = require('express');
const guard = require('express-jwt-permissions')();

const companyCheck = require('../guard/company');
const { findCLByName, createCL } = require('../queries/contactlist');

const router = express.Router();

router.post('/', guard.check('company'), companyCheck, async (req, res) => {
    const cl = await findCLByName(req.body.name);
    if (cl.length)
      return res
        .status(400)
        .json({ username: 'Contact List with given name already exists' });
  
    await createCL(req.body.name,req.user.id );
    return res.status(201).send('created');
  });