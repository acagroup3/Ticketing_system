const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/').get(userController.getProfileData);

router.route('/logout').get(userController.logout);

module.exports = router;
