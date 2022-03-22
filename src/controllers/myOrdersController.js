const Order = require("../models/order");
const Ticket = require('../models/ticket');
const User = require('../models/user');

// Get all orders list for user
async function getMyOrders(req, res) {
	try{
		const orders = await Order.findOne({ userId: req.headers['profile-id'] });
		res.send(orders.ordersList);
	}
	catch(err){
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

// Get specified by id order details
async function getMyOrder(req, res) {
	try {
		const order = await Order.findOne({ userId: req.headers['profile-id']},
										  {ordersList: {$elemMatch: {_id: req.params.orderId }}}); 
		res.send(order.ordersList[0]);

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

// Cancel one ticket from order, if possible
async function cancelTicket(req, res) {
	try {
		const {ticketId} = req.params;
		const userId = req.headers['profile-id'];
		const {orderId} = req.params;
		const ticket = await Ticket.findById(ticketId);
		const user = await User.findById(userId);
		
		if(ticket.canCancel && ticket.cancelDate >= Date.now()){
			// adding ticket quantity by one
			await Ticket.findByIdAndUpdate(ticketId, {quantity: (ticket.quantity + 1)});
			
			// giving user's mony back
			await User.findByIdAndUpdate(userId, {coins: (user.coins + ticket.price)});
			
			// deleting ticket from order, or deliting order if it contains only one ticket
			// if(order.ordersList.length === 1){
			// 		Order.deleteOne({_id: orderId}); ///????
			// }
			// TODO: query is not correct
			const canceledOrder = await Order.findByIdAndUpdate(userId, {ordersList: {$pull: {_id: orderId }}});
			console.log("updated orders: ", canceledOrder);
			res.status(201).json({ cancelled: 'success' });
		}
				


	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Something went wrong' });
	}
}

module.exports = { getMyOrders, getMyOrder, cancelTicket };
