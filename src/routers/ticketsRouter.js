const { Router } = require('express');
const { getAllTickets } = require('../controllers/ticketsController');

const router = Router();

/**
 * @swagger
 * /profile/tickets:
 *  get:
 *    summary: Returns a list of thickets
 *    description: Get all tickets
 *    tags: [Get all tickets]
 *    type: Array[Object]
 *    responses:
 *      200:
 *       description: Ok
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
router.get('/', getAllTickets);

module.exports = router;
