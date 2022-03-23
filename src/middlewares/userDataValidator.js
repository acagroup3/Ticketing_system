const { body, validationResult } = require('express-validator');
const countries = require('../utils/countryNames');

const validateFirstName = body('firstName').
	exists().withMessage('Request body must contain firstName').
	isString().withMessage('firstName must be of type string').
	trim().isLength({ min: 2, max: 30 }).withMessage('firstName must contain from 2 to 30 characters');

const validateLastName = body('lastName').
	exists().withMessage('Request body must contain lastName').
	isString().withMessage('lastName must be of type string').
	trim().isLength({ min: 2, max: 30 }).withMessage('lastName must contain from 2 to 30 characters');

const validateCountry = body('country').
	exists().withMessage('Request body must contain country').
	isString().withMessage('country must be of type string').
	trim().notEmpty().withMessage('country can not be empty').
	isIn(countries).withMessage('country name is not included in countryNames list');

const validateEmail = body('email').
	exists().withMessage('Request body must contain email').
	isString().withMessage('email must be of type string').
	trim().notEmpty().withMessage('email can not be empty').
	isEmail().withMessage('email is not valid').
	normalizeEmail();

const validatePassword = body('password').
	exists().withMessage('Request body must contain password').
	isString().withMessage('password must be of type string').
	isLength({ min: 6, max: 30 }).withMessage('password must contain from 6 to 32 symbols');

const errorHandler = (req, res, next) => {	
	const errors = validationResult(req).array();

	if (errors.length !== 0) {
		const errorsArray = [];
		errorsArray.push(errors[0].msg);

		// For each parameter send only first occuring error
		if (errors.length > 1) {
			for (let i = 1; i < errors.length; i++) {
				if (errors[i].param !== errors[i-1].param) {
					errorsArray.push(errors[i].msg)
				}
			}
		};		

      return res.status(400).json({ errors: errorsArray });
   } else next();
};

module.exports = {
	validateFirstName,
	validateLastName,
	validateCountry,
	validateEmail,
	validatePassword,
	errorHandler
};