const { Router } = require('express');
const myTicketsController = require('../controllers/myTicketsController');
const validateTicketData = require('../middlewares/ticketDataValidation');

const router = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: My Tickets
 *   securitySchemes:
 *     access-token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

/**
 * @swagger
 * /my-tickets:
 *  get:
 *   tags: [My Tickets]
 *   security:
 *   - access-token: []
 *   description: Tickets list, created by user.
 *   responses:
 *     200:
 *       description: Tickets list, created by user.
 *       content:
 *          application/json:
 *            schema:
 *               properties:
 *                 name:
 *                   type: String
 *                 date:
 *                   type: Date
 *                 price:
 *                   type: Number
 *               example: { X Performance        2022-03-28      15$,
 *                         Y Performance        2022-04-02      12$,
 *                         Z Performance        2022-04-14      13$,
 *                        ...}
 *     401:
 *       description: Unauthorized
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access-token is not set in request header
 *     404:
 *       description: Error:Not Found
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access token is not valid
 *     500:
 *       description: Server error
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Something went wrong.
 *
 */

/**
 * @swagger
 * /my-tickets:
 *  post:
 *   tags: [My Tickets]
 *   security:
 *   - access-token: []
 *   description: Ticket creation.
 *   parameters:
 *   - name: name
 *     in: body
 *     description: ticket name
 *     required: true
 *     type: string
 *   - name: description
 *     in: body
 *     description: ticket description
 *     required: true
 *     type: string
 *   - name: date
 *     in: body
 *     description: date of an event
 *     required: true
 *     type: date
 *   - name: price
 *     in: body
 *     description: ticket price
 *     required: true
 *     type: number
 *   - name: quantity
 *     in: body
 *     description: ticket quantity
 *     required: true
 *     type: number
 *   - name: canCancel
 *     in: body
 *     description: ticket cancalability
 *     required: false
 *     type: boolean
 *   - name: cancelDate
 *     in: body
 *     description: the date before which ticket can be canceled, available only if canCancel is true
 *     required: false
 *     type: date
 *   - name: countries
 *     in: body
 *     description: country names list, where the ticket is available, only users from this country/es can buy the ticket
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Created ticket.
 *       content:
 *          application/json:
 *            schema:
 *               properties:
 *                 name:
 *                   type: String
 *                 description:
 *                   type: String
 *                 date:
 *                   type: Date
 *                 price:
 *                   type: Number
 *                 quantity:
 *                   type: Number
 *                 initialQuantity:
 *                   type: Number
 *                 canCancel:
 *                   type: Boolean
 *                 cancelDate:
 *                   type: Date
 *                 countries:
 *                   type: Array[String]
 *                 likeCount:
 *                   type: Number
 *                 dislikeCount:
 *                   type: Number
 *               example:
 *                     Ticket: {"name": "Concert", "description": "Best concert ever.", "date": 2022-04-07,
 *                              "price": 15, "quantity": 159, "canCancel": true, "cancelDate": 2022-04-03,
 *                              "countries": "Armenia, Georgia", "likeCount": 0, "dislikeCount": 0}
 *     400:
 *       description: Incorrect Ticket data was entered
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Name is a mandatory field, it's shoul contain min 3 characters.
 *                     Date is a mandatory field, it must be in yyyy-mm-dd format and in the future.
 *                     Price must be numeric.
 *                     Quantity is a mandatory field.
 *                     Cancelability must be boolean.
 *                     Cancel date must be before ticket date.
 *                     Country name is incorrect.
 *     401:
 *       description: Unauthorized
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access-token is not set in request header
 *     404:
 *       description: Error:Not Found
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Access token is not valid
 *     500:
 *       description: Server error
 *       content:
 *         text/plain:
 *          schema:
 *            type: string
 *            example: Something went wrong.
 *
 */

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
		validateTicketData.validateCancelDate,
		validateTicketData.isBefore,
		validateTicketData.validateCountry,
		myTicketsController.createTicket
	)
	/**
	 * @swagger
	 * /profile/my-tickets/{id}:
	 *  put:
	 *   tags: [My Tickets]
	 *   security:
	 *    - access-token: []
	 *   parameters:
	 *   - in: path
	 *     name: id
	 *     required: true
	 *     type: id
	 *   schema:
	 *       type: object
	 *   requestBody:
	 *     required: true
	 *     content:
	 *       application/json:
	 *          schema:
	 *               properties:
	 *                 name:
	 *                   type: String
	 *                   required: true
	 *                   description: Event name
	 *                   example: "The Moon"
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
	 *                   example: 525
	 *                 cancelDate:
	 *                   type: Date
	 *                   description:  before this date, the user can cancel the order for any reason and get their money back
	 *                   example: 2022.09.11
	 *                 countries:
	 *                   type: Array[String]
	 *                   description: Array of countries where the ticket is available
	 *                   example: ['Armenia', England]
	 *   responses:
	 *     200:
	 *       description: Ticket was successfully updated
	 *       content:
	 *         text/plain:
	 *          schema:
	 *            type: string
	 *            example: edited
	 *     400:
	 *       description: wrong input
	 *       content:
	 *         application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              error:
	 *                type: string
	 *            example:
	 *              error: wrong data
	 */

	.patch(
		'/:id',
		validateTicketData.validateName,
		validateTicketData.validateDescription,
		validateTicketData.validateDate,
		myTicketsController.editTicket
	)
	/**
	 * @swagger
	 * /profile/my-tickets/{id}:
	 *  delete:
	 *   tags: [My Tickets]
	 *   security:
	 *    - access-token: []
	 *   description: delete ticket.
	 *   produces:
	 *   - application/json:
	 *   parameters:
	 *   - name: id
	 *     in: path
	 *     required: true
	 *     schema:
	 *        type: string
	 *     description: Id of the ticket  need to be deleted.
	 *     type: id
	 *   responses:
	 *     204:
	 *       description: Ticket deleted
	 *     400:
	 *       description:  no ticket with such ID.
	 *     404:
	 *       description: Error:Not found.
	 */
	.delete('/:id', myTicketsController.deleteTicket);

module.exports = router;
