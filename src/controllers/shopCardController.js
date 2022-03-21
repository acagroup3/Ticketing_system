const User = require('../models/user')
const Ticket = require('../models/ticket')
const Order = require('../models/order')

async function getShopCard(req, res) {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] })

		if (user.shoppingCard.length === 0) {// Do we have tickets in the shopping card
			res.json({ message: `You don't have tickets in the shopping card.` })
			return
		}

		const totalPrice = user.shoppingCard.reduce((acc, ticket) => {// calculate total price
			return acc + ticket.price
		}, 0)

		res.json({
			totalPrice,
			shoppingCard: user.shoppingCard
		})
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
		});
	};
}

async function buyShopCardTickets(req, res) {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] })

		if (user.shoppingCard.length === 0) {
			res.json({ message: "You don't have tickets in the shopping card." })
			return
		}

		const price = user.shoppingCard.reduce((acc, ticket) => acc += +ticket.price, 0)
		if (user.coins < price) { // Do we have enough money?
			res.status(400).json({
				error: 'Purchase failed!',
				message: `You need ${price} coins to buy all tickets.Your balance: ${user.coins}`
			})
			return
		}

		const { shoppingCard } = await User.findOne({ _id: req.headers['profile-id'] }).populate('shoppingCard.ticketId')
		const outOfStockTickets = shoppingCard.reduce((acc, ticket) => { // Find tickets that are already out of stock.
			if (ticket.ticketId.quantity === 0) {
				acc.push(ticket.ticketId._id)
			}
			return acc
		}, [])

		if (outOfStockTickets.length !== 0) {
			res.status(400).json({
				error: 'Purchase failed!',
				message: 'You have ticket(s) in your shopping card that are already out of stock.',
				tickets: JSON.stringify({
					outOfStockTickets
				})
			})
			return
		}

		const order = []
		shoppingCard.forEach(async function (ticket) {
			order.push(ticket.ticketId._id.toString()) // Save ticketId 

			await User.findByIdAndUpdate(user._id, { $inc: { coins: -1 * +ticket.price } }) // decrease user coins

			await User.findByIdAndUpdate(ticket.ticketId.userId, { $inc: { coins: +ticket.price } }) // add ticket owner coins

			await Ticket.findByIdAndUpdate(ticket.ticketId._id, { $inc: { quantity: -1 } }) // quantity - 1

			await User.findByIdAndUpdate(user._id, { $pop: { shoppingCard: -1 } }) // pop each ticket from shopCard

		})

		await Order.findOneAndUpdate({ userId: user._id }, { $push: { ordersList: { order } } }) // Add new order into Order collection orderList

		res.status(201).json({
			statusMes: 'Order created',
			message: `Purchase made successfully.${price} coins withdrawn from you account.`
		})
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
		});
	};
}

async function deleteFromShopCard(req, res) {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] })
		const { ticketId } = req.params

		const ticketIndexInShopCard = user.shoppingCard.reduce((acc, ticket, index) => {
			if (ticket.ticketId.toString() === ticketId) { acc = index }
			return acc
		}, -1)

		if (ticketIndexInShopCard === -1) { // If no ticket with such ID
			res.status(400).json({
				error: 'Deleting failed!',
				message: 'There is no ticket with such ID in your shopping card.'
			})
			return
		}

		user.shoppingCard.splice(ticketIndexInShopCard, 1) // Remove ticket from shoppingCard
		user.save()

		res.json({
			message: `Ticket with ID(${ticketId}) has been successfully removed from your shopping card.`
		})
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
		});
	};
}

module.exports = {
	getShopCard,
	buyShopCardTickets,
	deleteFromShopCard
}
