const { Router } = require('express');

const ticketsController = require('../controllers/ticketsController');
const ticketIdValidation = require('../middlewares/ticketIdValidation');
const buyOneTicketOneTime = require('../middlewares/oneTicketOneTime');

const ticketsRouter = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Tickets
 *   securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Ticket:
 *    type: object
 *    properties:
 *      _id:
 *        type: String
 *        description: Id of ticket
 *        example: 6234bdf33419f131ad38f92c
 *      name:
 *        type: String
 *        required: true
 *        description: Event name
 *        example: "The Moon"
 *      userId:
 *        type: String
 *        description: Id of owner
 *        example: 6234bdf33419f131ad38f92c
 *      date:
 *        type: Date
 *        required: true
 *        description: Event date
 *        example: 2022.10.01
 *      description:
 *        type: String
 *        required: true
 *        description: Event info
 *        example: The event will start at 4 30pm with Jeanna Lambrew
 *      price:
 *        type: Number
 *        required: true
 *        description: Price of ticket
 *        example: 100
 *      quantity:
 *        type: Number
 *        required: true
 *        description: Available quantity of ticket
 *        example: 5
 *      initialQuantity:
 *        type: Number
 *        description: Initial quantity of ticket
 *        example: 10
 *      canCancel:
 *        type: Boolean
 *        description: can or not  cancel the order
 *        example: true
 *      cancelDate:
 *        type: Date
 *        description:  before this date, the user can cancel the order for any reason and get their money back
 *        example: 2022.09.11
 *      countries:
 *        type: Array[String]
 *        description: Array of countries where the ticket is available
 *        example: ['Armenia', England]
 *      likeCount:
 *        type: Number
 *        description: Number of likes
 *        example: 102
 *      dislikeCount:
 *        type: Number
 *        description: Number of dislikes
 *        example: 3
 *
 *
 */

// /tickets/:ticketID/_addToCard
/**
 * @swagger
 * /tickets/{ticketId}/_addToCard:
 *  get:
 *   tags: [Tickets]
 *   description: Add ticket to shopping card.
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   - name: ticketId
 *     in: path
 *     description: Id of the ticket what to be added in shopping card.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *       description: The ticket has been successfully added.
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: The ticket has been successfully added to your Shopping Card.
 *     400:
 *       description: You can buy one ticket one time.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              message:
 *                type: string
 *            example:
 *              error: You can buy one ticket one time.
 *              message: You already bought such ticket or it is in your Shopping card.
 *     401:
 *       description: Unauthorized
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access-token is not set in request header
 *     404:
 *       description: Error:Not found.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: Non-existent ID.
 *              errorMes: Ticket with such ID does not exist.
 *     409:
 *       description: Conflict.ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMes: ID must be a string of 12 bytes or a string of 24 hex characters.
 *
 */

// /tickets/:ticketID/comments
/**
 * @swagger
 * /tickets/{ticketId}/comments:
 *  get:
 *   tags: [Tickets]
 *   description: Get all comments about ticket with ID(ticketId)
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   - name: ticketId
 *     in: path
 *     description: Id of the ticket to get comments.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *       description: Comments received successfully.
 *       content:
 *         text/plain:
 *          schema:
 *            type: object
 *            example: [{"content": "Football is a goode sport.", "date": "**.**.***", "userID": {"info": "..."}, "ticketId": "********"}, ...]
 *     401:
 *       description: Unauthorized
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access-token is not set in request header
 *     404:
 *       description: Error:Not found.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: Non-existent ID.
 *              errorMes: Ticket with such ID does not exist.
 *     409:
 *       description: Conflict.ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMes: ID must be a string of 12 bytes or a string of 24 hex characters.
 *
 */

/**
 * @swagger
 * /tickets/{ticketId}/comments:
 *  post:
 *   tags: [Tickets]
 *   description: Add comments about ticket with ID(ticketId)
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   - name: ticketId
 *     in: path
 *     description: Id of the ticket to add comments.
 *     required: true
 *     type: id
 *   requestBody:
 *     description: Optional description in *Markdown*
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *   responses:
 *     201:
 *       description: Comment successfully posted.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *              content:
 *                type: string
 *            example:
 *              message: Comment successfully posted.
 *              content: "New comment"
 *     204:
 *       description: Content no contain any symbol.(Maybe only spaces)
 *     401:
 *       description: Unauthorized
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access-token is not set in request header
 *     404:
 *       description: Error:Not found.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: Non-existent ID.
 *              errorMes: Ticket with such ID does not exist.
 *     409:
 *       description: Conflict.ID does not match rules.
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              errorMes:
 *                type: string
 *            example:
 *              error: ID does not match rules.
 *              errorMes: ID must be a string of 12 bytes or a string of 24 hex characters.
 *
 */

/**
 * @swagger
 * /tickets:
 *  get:
 *    summary: Returns a list of thickets
 *    description: Get all tickets
 *    tags: [Get all tickets]
 *    security:
 *    - access-token: []
 *    operationId: findTicketByCountry
 *    produces:
 *    - application/json
 *    - application/xml
 *    parameters:
 *    - name: sort
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
 *    - name: page
 *      in: query
 *      description: number of tickets in one page
 *      required: false
 *      type: number
 *    - name: limit
 *      in: query
 *      description: number of tickets in one page
 *      required: false
 *      type: number
 *    - name: attributes
 *      in: query
 *      description: show only given data
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
	.get('/:id/_like', ticketsController.likeTicket)
	.get('/:id/_buy', ticketsController.buyTicket);

ticketsRouter.use((err, req, res, next) => {
	console.log(err);
});

module.exports = ticketsRouter;
