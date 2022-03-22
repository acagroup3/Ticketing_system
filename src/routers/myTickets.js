const { Router } = require('express');
const myTicketsController = require('../controllers/myTicketsController');
const validateTicketData = require('../middlewares/ticketDataValidation');

const router = Router();

router
	.get('/', myTicketsController.getMyTickets)
	.post(
		'/',
		validateTicketData.validateName,
		validateTicketData.validateDescription,
		validateTicketData.validateDate,
		validateTicketData.validatePrice,
		validateTicketData.validateQuantity,
		validateTicketData.validatecanCancel,
		// validateTicketData.validateCancelDate,
		validateTicketData.validateCountry,
		myTicketsController.createTicket
	)
	.patch(
		'/:id',
		validateTicketData.validateName,
		validateTicketData.validateDescription,
		validateTicketData.validateDate,
		myTicketsController.editTicket
	)
	.delete('/:id', myTicketsController.deleteTicket);

module.exports = router;
