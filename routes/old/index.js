const { Router } = require('express');
const users = require('./users');
const services = require('./services');
const staff = require('./staff');
const waitList = require('./waitList');
const homeScreen = require('./homeScreen');
const messages = require('./messages');
const admin = require('./admin');

const router = Router();

router.use('/users', users);
router.use('/admin', admin);
router.use('/services', services);
router.use('/staff', staff);
router.use('/waitList', waitList);
router.use('/homeScreen', homeScreen);
router.use('/messages', messages);

module.exports = router;
