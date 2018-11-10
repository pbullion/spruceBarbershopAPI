const { Router } = require('express');
const users = require('./users');
const services = require('./services');
const staff = require('./staff');

const router = Router();

router.use('/users', users);
router.use('/services', services);
router.use('/staff', staff);

module.exports = router;
