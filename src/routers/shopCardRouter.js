const { Router } = require('express')

const shopCardController = require('../controllers/shopCardController')
const ticketIdValidation = require('../middlewares/ticketIdValidation')

const shopCardRouter = Router()

shopCardRouter.get('/', shopCardController.getShopCard)
shopCardRouter.delete('/', shopCardController.emptyShopCard)
shopCardRouter.get('/_buy', shopCardController.buyShopCardTickets)
shopCardRouter.delete('/:ticketId', ticketIdValidation, shopCardController.deleteFromShopCard)

shopCardRouter.use((err, req, res, next) => {
	console.log(err)
})

module.exports = shopCardRouter
