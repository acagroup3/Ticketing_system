const { Router } = require('express');
const ticketsController = require('../controllers/ticketsController');

const ticketsRouter = Router();

ticketsRouter.get('/', ticketsController.getAllTickets);
ticketsRouter.get('/:ticketId/comments', ticketsController.getComments)

module.exports = ticketsRouter;
