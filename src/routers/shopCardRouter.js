const { Router } = require('express')

const shopCardController = require('../controllers/shopCardController')
const ticketIdValidation = require('../middlewares/ticketIdValidation')

const shopCardRouter = Router()

/**
 * @swagger
 * components:
 *   tags:
 *    - name: ShoppingCard
 *   securitySchemes:
 *     access-token:      
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 * 
 */

/**
 * @swagger
 * /shopping-card:
 *  get:
 *   tags: [ShoppingCard]
 *   description: Tickets that have been added to shopping card.
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Tickets in the shopping card and total price.
 *       content:
 *         application/json:
 *          schema:    
 *            type: object
 *            properties:
 *              totalPrice:
 *                type: integer
 *              shoppingCard:
 *                type: object
 *            example:   
 *              totalPrice: 152
 *              shoppingCard: [{"ticketId": ID,"ticketName": name,"price": 152}, {},{}, ...]
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
 *   
 */

shopCardRouter.get('/', shopCardController.getShopCard)

/**
 * @swagger
 * /shopping-card:
 *  delete:
 *   tags: [ShoppingCard]
 *   description: Empty shopping card.
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Shopping card has been emptied.
 *       content:
 *         text/plain:
 *          schema:    
 *            type: string
 *            example: (Your shopping card is already empty) OR (Your shopping card has been emptied) 
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
 */

shopCardRouter.delete('/', shopCardController.emptyShopCard)

/**
 * @swagger
 * /shopping-card/_buy:
 *  get:
 *   tags: [ShoppingCard]
 *   description: Buy all tickets in shopping card.
 *   parameters:
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Your shopping card is empty.
 *       content:
 *         text/plain:
 *          schema:    
 *            type: string
 *            example: You don't have tickets in the shopping card
 *     400:
 *       description: You don't have enough coins.
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
 *              error: Purchase failed!
 *              message: (You need ??? coins to buy all tickets.Your balance ??? coins.) OR (You have ticket(s) in your shopping card that are already out of stock.)
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
 */

shopCardRouter.get('/_buy', shopCardController.buyShopCardTickets)

/**
 * @swagger
 * /shopping-card/{ticketId}:
 *  delete:
 *   tags: [ShoppingCard]
 *   description: Remove ticket with ID [ticketID] from shopping card.
 *   parameters:
 *   - name: ticketId
 *     in: path
 *     description: Id of the ticket what need to be deleted.
 *     required: true
 *     type: id
 *   - name: access-token
 *     in: header
 *     description: an authorization header
 *     required: true
 *     type: string
 *   responses:
 *     200:
 *       description: Ticket has been removed.
 *       content:
 *         text/plain:
 *          schema:    
 *            type: string
 *            example: Ticket with ID(ticketId) has been successfully removed from your shopping card
 *     400:
 *       description: In your shopping card no ticket with such ID.
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
 *              error: Deleting failed!
 *              message: There is no ticket with such ID in your shopping card
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
 */

shopCardRouter.delete('/:ticketId', ticketIdValidation, shopCardController.deleteFromShopCard)

shopCardRouter.use((err, req, res, next) => {
	console.log(err)
})

module.exports = shopCardRouter
