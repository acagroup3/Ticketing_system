const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(authController.addUser);

router.route('/verify/:user_id').get(authController.verifyUser);

router.route('/login').post(authController.login);

module.exports = router;
