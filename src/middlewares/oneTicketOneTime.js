const Order = require('../models/order')
const User = require('../models/user')
async function buyOneTicketOneTime(req, res, next) {
	// YOU CAN BUY ONE TICKET ONE TIME
	const user = await User.findOne({ _id: req.headers['profile-id'] })
	const { ticketId } = req.params

	const userOrders = await Order.findOne({ userId: user._id })
	let didWeBuySuchTicket = userOrders.ordersList.reduce((result, orderObject) => {
		if (result) { //if result === true -> we already have such order 
			return result
		}

		orderObject.order.reduce((acc, boughtTicketId) => {
			if (boughtTicketId.toString() === ticketId) {
				result = true
			}
		}, 0)

		return result;

	}, false)

	if (!didWeBuySuchTicket) { // if no in orders -> search in the shopping card
		const isTicketInCard = user.shoppingCard.reduce((result, ticket) => {
			return ticket.ticketId.toString() === ticketId
		}, false)

		didWeBuySuchTicket = isTicketInCard // Let's assume it's the same!
	}

	if (didWeBuySuchTicket) {
		res.status(400).json({
			error: 'You can buy one ticket one time.',
			message: 'You already bought such ticket or it is in your Shopping card.'
		})
		next('You can buy one ticket one time.')
	}

	next()
}

module.exports = buyOneTicketOneTime
