const { Router } = require('express');
const { getAllTickets, getTicketDetails } = require('../controllers/ticketsController');

const router = Router();
router
	.get('/', getAllTickets)
	.get('/:id', getTicketDetails);
;

module.exports = router;
