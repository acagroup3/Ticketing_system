const express = require('express');
const authController = require('../controllers/authController');
const userDataValidator = require('../middlewares/userDataValidator');

const router = express.Router();

router.route('/register').post(
	userDataValidator.validateFirstName,
	userDataValidator.validateLastName,
	userDataValidator.validateCountry,
	userDataValidator.validateEmail,
	userDataValidator.validatePassword,
	userDataValidator.errorHandler,
	authController.addUser
);

router.route('/verify/:verificationToken').get(authController.verifyUser);

router.route('/login').post(
	userDataValidator.validateEmail,
	userDataValidator.validatePassword,
	userDataValidator.errorHandler,
	authController.login
);

module.exports = router;
