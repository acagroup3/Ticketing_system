const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/').get(userController.getProfileData);

module.exports = router;
