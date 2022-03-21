const { Router } = require('express');

const ticketsController = require('../controllers/ticketsController');
const ticketIdValidation = require('../middlewares/ticketIdValidation')
const buyOneTicketOneTime = require('../middlewares/oneTicketOneTime')

const ticketsRouter = Router();

ticketsRouter
	.get('/', ticketsController.getAllTickets)
	.get('/:ticketId/comments', ticketIdValidation, ticketsController.getComments)
	.post('/:ticketId/comments', ticketIdValidation, ticketsController.addComment)
	.get('/:ticketId/_addToCard', ticketIdValidation, buyOneTicketOneTime, ticketsController.addToShoppingCard)
	.get('/:id', ticketsController.getTicketDetails)
	.post('/:id/_like', ticketsController.likeTicket)
	.post('/:id/_buy', ticketsController.buyTicket)

ticketsRouter.use((err, req, res, next) => {
	console.log(err)
})

module.exports = ticketsRouter;
