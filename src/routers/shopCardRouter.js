const { Router } = require('express')
const shopCardController = require('../controllers/shopCardController')

const shopCardRouter = Router()

shopCardRouter.get('/', shopCardController.getShopCard)
shopCardRouter.get('/_buy', shopCardController.buyShopCard)
shopCardRouter.delete('/:ticketId', shopCardController.deleteFromShopCard)

module.exports = shopCardRouter
