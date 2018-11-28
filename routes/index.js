const { Router } = require('express');
const users = require('./users');
const services = require('./services');
const staff = require('./staff');
const waitList = require('./waitList');
const homeScreen = require('./homeScreen');

const router = Router();

router.use('/users', users);
router.use('/services', services);
router.use('/staff', staff);
router.use('/waitList', waitList);
router.use('/homeScreen', homeScreen);

module.exports = router;
