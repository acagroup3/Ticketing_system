const User = require('../models/user')
const Ticket = require('../models/ticket')

async function getShopCard(req, res) {
	const user = await User.findOne({ _id: req.headers['profile-id'] })

	if (user.shoppingCard.length === 0) {
		res.send("You don't have tickets in the shopping card.")
		return
	}

	res.send(user.shoppingCard)
}

async function buyShopCard(req, res) {
	const user = await User.findOne({ _id: req.headers['profile-id'] })

	if (user.shoppingCard.length === 0) {
		res.send('Your shopping card are empty.')
		return
	}

	const price = user.shoppingCard.reduce((acc, ticket) => acc += +ticket.price, 0)
	if (user.coins < price) { // Do we have enough money?
		res.send(`
    		Purchase failed!
      		You need ${price} coins to buy all tickets.
			Your balance: ${user.coins}
        `)
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
		res.send(`
        	Purchase failed!
      		You have ticket(s) in your shopping card that are already out of stock.
      		Ticket(s) ID 
      		{ 
        	[${outOfStockTickets}]
      		}`)
		return
	}

	shoppingCard.forEach(async function (ticket) {
		await User.findByIdAndUpdate(user._id, { $inc: { coins: -1 * +ticket.price } }) // decrease user coins

		await User.findByIdAndUpdate(ticket.ticketId.userId, { $inc: { coins: +ticket.price } }) // add ticket owner coins

		await Ticket.findByIdAndUpdate(ticket.ticketId._id, { $set: { quantity: +ticket.ticketId.quantity - 1 } }) // quantity - 1

		await User.findByIdAndUpdate(user._id, { $pop: { shoppingCard: -1 } }) // pop each ticket from shopCard
	})

	res.send(`
    	Purchase made successfully.
    	${price} coins withdrawn from you account.`)
}

async function deleteFromShopCard(req, res) {
	const user = await User.findOne({ _id: req.headers['profile-id'] })
	const { ticketId } = req.params

	const ticketIndexInSHopCard = user.shoppingCard.reduce((acc, ticket, index) => {
		if (ticket.ticketId.toString() === ticketId) { acc = index }
		return acc
	}, -1)

	if (ticketIndexInSHopCard === -1) { // If no ticket with such ID
		res.send(`
			Deleting failed!
			There is no ticket with such ID in your shopping card.
		`)
		return
	}

	user.shoppingCard.splice(ticketIndexInSHopCard, 1) // Remove ticket from shoppingCard
	user.save()

	res.send(`Ticket with ID(${ticketId}) has been successfully removed from your shopping card.`)
}

module.exports = {
	getShopCard,
	buyShopCard,
	deleteFromShopCard
}
