const express = require('express');

const router = express.Router();
const {
	getAllTickets,
	createTicket,
	getTicket,
	updateTicket,
	deleteTicket,
} = require('../controllers/ticketControllers');

router.route('/').get(getAllTickets).post(createTicket);
router.route('/:id').get(getTicket).patch(updateTicket).delete(deleteTicket);
module.exports = router;
