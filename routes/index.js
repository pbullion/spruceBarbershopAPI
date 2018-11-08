const { Router } = require('express');
const users = require('./users');
const services = require('./services');

const router = Router();

router.use('/users', users);
router.use('/services', services);

module.exports = router;
