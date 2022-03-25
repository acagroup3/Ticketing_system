const { Router } = require('express');
const myOrdersController = require('../controllers/myOrdersController');

const router = Router();

/**
 * @swagger
 * components:
 *   tags:
 *    - name: Orders
 *   securitySchemes:
 *     access-token:      
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 * 
 */

/**
 * @swagger
 * /profile/my-orders:
 *  get:
 *   tags: [Orders]
 *   security:
 *    - access-token: []
 *   description: User orders list, total price and date for each order.
 *   responses:
 *     200:
 *       description: User orders list, total price and date for each order.
 *       content:
 *         application/json:
 *          schema:    
 *            type: object
 *            properties:
 *              order:
 *                type: object
 *              totalPrice:
 *                type: integer
 *              orderDate:
 *                type: date
 *            example:   
 *              Orders: [{"ticket1": "ticketName1", "ticket2": "ticketName2", ..., totalPrice: 256, date: yyyy-mm-dd}, {},{}, ...]
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
 * /profile/my-orders/{orderId}:
 *  get:
 *   tags: [Orders]
 *   security:
 *    - access-token: []
 *   description: One order details, tickets list, prices, orderDate, totalPrice.
 *   parameters:
 *   - name: orderId
 *     in: path
 *     description: Id of the order, which details user want to get.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *       description: One order details, tickets list, prices, orderDate, totalPrice.
 *       content:
 *         application/json:
 *          schema:    
 *            type: object
 *            properties:
 *              order:
 *                type: object
 *              totalPrice:
 *                type: integer
 *              orderDate:
 *                type: date
 *              ticketsList:
 *                type: object
 *            example:   
 *              Order: [{"ticket1": "ticketName1", "ticketPrice": 14}, {"ticket2": "ticketName2", "ticketPrice": 60}, {}, ..., totalPrice: 256, date: yyyy-mm-dd]
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
 * /profile/my-orders/{orderId}/{ticketId}:
 *  delete:
 *   tags: [Orders]
 *   security:
 *    - access-token: []
 *   description: Ticket cancelation.
 *   parameters:
 *   - name: orderId
 *     in: path
 *     description: Id of the order in which cancelled ticket was bought.
 *     required: true
 *     type: id
 *   - name: ticketId
 *     in: path
 *     description: Id of the canceled ticket.
 *     required: true
 *     type: id
 *   responses:
 *     200:
 *       description: One order details, tickets list, prices, orderDate, totalPrice.
 *       content:
 *         application/json:
 *          schema:    
 *            type: object
 *            example: Ticket has been successfully canceled.
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
	.get('/', myOrdersController.getMyOrders)
	.get('/:orderId', myOrdersController.getMyOrder)
	.delete('/:orderId/:ticketId', myOrdersController.cancelTicket);

module.exports = router;
