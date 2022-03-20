const { Router } = require('express');
const myOrdersController = require('../controllers/myOrdersController');

const router = Router();

/**
 * @swagger
 * /profile/my-orders:
 *  get:
 *   tags: [User Orders]
 *   description: Getting User Orders List.
 *   requestBody:
 *     required: false
 *
 */

router
	.get('/', myOrdersController.getMyOrders)
	.get('/:orderId', myOrdersController.getMyOrder)
	.delete('/:orderId/:ticketId', myOrdersController.cancelTicket);

module.exports = router;
