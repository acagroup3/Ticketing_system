const { Router } = require('express');

const ticketsController = require('../controllers/ticketsController');
const ticketIdValidation = require('../middlewares/ticketIdValidation');
const buyOneTicketOneTime = require('../middlewares/oneTicketOneTime');

const ticketsRouter = Router();

/**
 * @swagger
 * /tickets:
 *  get:
 *    summary: Returns a list of thickets
 *    description: Get all tickets
 *    tags: [Get all tickets]
 *    operationId: findTicketByCountry
 *    produces:
 *    - application/json
 *    - application/xml
 *    parameters:
 *    - name: filter
 *      in: query
 *      description: values that need for filtering
 *      required: false
 *      type: array
 *      items:
 *       type: string
 *       enum:
 *       - price
 *       - name
 *       - likeCount
 *       - dislikeCount
 *       default: price
 *      collectionFormat: multi
 *    responses:
 *      200:
 *       description: Success
 *      404:
 *        description: Error
 *        content:
 *          application/json:
 *            schema:
 *               properties:
 *                 _id:
 *                   type: String
 *                   description: Id of ticket
 *                   example: 6234bdf33419f131ad38f92c
 *                 userId:
 *                   type: String
 *                   description: Id of owner
 *                   example: 6234bdf33419f131ad38f92c
 *                 date:
 *                   type: Date
 *                   required: true
 *                   description: Event date
 *                   example: 2022.10.01
 *                 description:
 *                   type: String
 *                   required: true
 *                   description: Event info
 *                   example: The event will start at 4 30pm with Jeanna Lambrew
 *                 price:
 *                   type: Number
 *                   required: true
 *                   description: Price of ticket
 *                   example: 100
 *                 quantity:
 *                   type: Number
 *                   required: true
 *                   description: Available quantity of ticket
 *                   example: 5
 *                 initialQuantity:
 *                   type: Number
 *                   description: Initial quantity of ticket
 *                   example: 10
 *                 canCancel:
 *                   type: Boolean
 *                   description: can or not  cancel the order
 *                   example: true
 *                 cancelDate:
 *                   type: Date
 *                   description:  before this date, the user can cancel the order for any reason and get their money back
 *                   example: 2022.09.11
 *                 countries:
 *                   type: Array[String]
 *                   description: Array of countries where the ticket is available
 *                   example: ['Armenia', England]
 *                 likeCount:
 *                   type: Number
 *                   description: Number of likes
 *                   example: 102
 *                 dislikeCount:
 *                   type: Number
 *                   description: Number of dislikes
 *                   example: 3
 */

ticketsRouter
	.get('/', ticketsController.getAllTickets)
	.get(
		'/:ticketId/comments',
		ticketIdValidation,
		ticketsController.getComments
	)
	.post(
		'/:ticketId/comments',
		ticketIdValidation,
		ticketsController.addComment
	)
	.get(
		'/:ticketId/_addToCard',
		ticketIdValidation,
		buyOneTicketOneTime,
		ticketsController.addToShoppingCard
	)
	.get('/:id', ticketsController.getTicketDetails)
	.post('/:id/_like', ticketsController.likeTicket)
	.post('/:id/_buy', ticketsController.buyTicket);

ticketsRouter.use((err, req, res, next) => {
	console.log(err);
});

module.exports = ticketsRouter;
