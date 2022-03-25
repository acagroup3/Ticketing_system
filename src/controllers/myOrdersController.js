const Order = require('../models/order');
const Ticket = require('../models/ticket');
const User = require('../models/user');

// Get all orders list for user
async function getMyOrders(req, res) {
	try {
		const orders = await Order.findOne({
			userId: req.headers['profile-id'],
		});
		res.send(orders.ordersList);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

// Get specified by id order details
async function getMyOrder(req, res) {
	try {
		const order = await Order.findOne(
			{ userId: req.headers['profile-id'] },
			{ ordersList: { $elemMatch: { _id: req.params.orderId } } }
		);

		res.send(order.ordersList[0]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

// Cancel one ticket from order, if possible
async function cancelTicket(req, res) {
	try {
		const { ticketId } = req.params;
		const userId = req.headers['profile-id'];
		const { orderId } = req.params;
		const ticket = await Ticket.findById(ticketId);
		const user = await User.findById(userId);

		if (ticket.canCancel && ticket.cancelDate >= Date.now()) {
			// adding ticket quantity by one
			await Ticket.findByIdAndUpdate(ticketId, {
				quantity: ticket.quantity + 1,
			});

			// giving user's mony back
			await User.findByIdAndUpdate(userId, {
				coins: user.coins + ticket.price,
			});

			// deleting ticket from order, or deliting order if it contains only one ticket
			// and decreasing total price of order
			const orders = await Order.findOne({
				userId: req.headers['profile-id'],
			});

			for (let i = 0; i < orders.ordersList.length; i += 1) {
				if (
					JSON.stringify(orders.ordersList[i]._id) ===
					JSON.stringify(orderId)
				) {
					if (orders.ordersList[i].order.length === 1) {
						orders.ordersList.splice(i, 1);
						break;
					} else {
						const index = orders.ordersList[i].order.findIndex(
							(ticketToDelete) =>
								JSON.stringify(ticketToDelete) ===
								JSON.stringify(ticketId)
						);
						orders.ordersList[i].order.splice(index, 1);
						orders.ordersList[i].order.totalPrice -= ticket.price;
						break;
					}
				}
			}
			await orders.save();

			res.status(204).send('cancelled');
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

module.exports = { getMyOrders, getMyOrder, cancelTicket };
