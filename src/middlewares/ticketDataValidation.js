const {body} = require("express-validator");
const countries = require("../utils/countryNames");

const validateName = 
	body("name").trim().isLength({ min: 3 }).withMessage("Name shoul contain min 3 characters.");

const validateDescription = 
	body("description").trim().isLength({ min: 10 }).withMessage("Description shoul contain min 10 characters.");

const validateDate =
    body("date").isDate().withMessage("Invalid date").isAfter().withMessage("Date must be in future.");

const validatePrice =
    body("price").isNumeric().withMessage('Price must be numeric.');

const validateQuantity = 
	body("quantity").isNumeric().withMessage('Quantity must be numeric.');

const validateCancelDate = 
	body("cancelDate").isAfter().withMessage("Invalid date")
	.isBefore(body("date")).withMessage("Cancel date must be before ticket date.");

const validateCountry =
	body("countries").isIn(countries);

module.exports = {
	validateName,
	validateDescription,
	validateDate,
	validatePrice,
	validateQuantity,
	validateCancelDate,
	validateCountry
};