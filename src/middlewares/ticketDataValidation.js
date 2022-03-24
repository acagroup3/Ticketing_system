const {body} = require("express-validator");
const countryNames = require("../utils/countryNames");

const validateName = 
	body("name").trim().isLength({ min: 3 })
	.withMessage("Name is a mandatory field, it's shoul contain min 3 characters.");

const validateDescription = 
	body("description").trim().isLength({ min: 10 })
	.withMessage("Description is a mandatory field, it's shoul contain min 10 characters.");

const validateDate =
    body("date").not().isEmpty()
	.withMessage('Date is a mandatory field, it must be in yyyy-mm-dd format and in the future.')
	.isDate().withMessage("Invalid date, should be in yyyy-mm-dd format and in the future")
	.isAfter().withMessage("Date must be in future.");

const validatePrice =
    body("price").not().isEmpty().withMessage("Price is a mandatory field.")
	.isNumeric().withMessage("Price must be numeric.");

const validateQuantity = 
	body("quantity").not().isEmpty().withMessage("Quantity is a mandatory field.")
	.isNumeric().withMessage("Quantity must be numeric.");

const validatecanCancel = 
	body("canCancel").isBoolean().withMessage("Cancelability must be boolean.")
	.default(false);

const validateCancelDate = 
	body("cancelDate").isDate().withMessage("Invalid date, should be in yyyy-mm-dd format and in the future")
	.isAfter().withMessage("Invalid date")
	// TODO: isBefore doesn't work as expected, it's always returns error
	// .isBefore("date").withMessage("Cancel date must be before ticket date.");

const isBefore = (req, res, next) => {
	if(req.body.date < req.body.cancelDate){
		res.status(400).json({ error: "Cancel date must be before ticket date." });
		next("Cancel date must be before ticket date.");
	}
	next();
}

const validateCountry = (req, res, next) => {
	const countries = req.body.countries.split(", ");
	// eslint-disable-next-line no-restricted-syntax
	for (const country of countries) {
		if(!countryNames.includes(country)){
			res.status(400).json({ error: "Country name is incorrect." });
			next("Country name is incorrect.");
		}
	  }
	req.body.countries = countries;
	next();
}
	

module.exports = {
	validateName,
	validateDescription,
	validateDate,
	validatePrice,
	validateQuantity,
	validatecanCancel,
	validateCancelDate,
	isBefore,
	validateCountry
};