const { Router } = require('express');

const ticketsController = require('../controllers/ticketsController');

const ticketsRouter = Router();

ticketsRouter
	.get('/', ticketsController.getAllTickets)
	.get('/:ticketId/comments', ticketsController.getComments)
	.get('/:id', ticketsController.getTicketDetails);

module.exports = ticketsRouter;
