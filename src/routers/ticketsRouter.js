const { Router } = require('express');

const ticketsController = require('../controllers/ticketsController');
const ticketIdValidation = require('../middlewares/ticketIdValidation')
const buyOneTicketOneTime = require('../middlewares/oneTicketOneTime')

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
