const Ticket = require('../models/ticket');
const TicketFeatures = require('../utils/appFeatures');
const User = require('../models/user');
const Comment = require('../models/comment');
const Order = require('../models/order');


exports.getAllTickets = async (req, res) => {
	try {
		const user = await User.findOne({
			_id: req.headers['profile-id'],
		});
		const features = new TicketFeatures(
			Ticket.find({ countries: user.country }),
			req.query
		)
			.filter()
			.sort()
			.limitattribute()
			.paginate();
		const tickets = await features.query;

		res.status(200).json({
			status: 'Ok',
			count: tickets.length,
			data: {
				tickets,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
}

exports.getComments = async (req, res) => {
	try {
		const ticketComments = await Comment.find({ ticketId: req.params.ticketId }, 'content date ticketId').populate('userId', 'firstName lastName country')

		res.send(ticketComments)
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
		});
	};
}

exports.addComment = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] })

		const { content } = req.body
		if (content.trim().length === 0) { // if content no contain any symbol
			res.sendStatus(204)
			return
		}

		await Comment.create({
			content,
			userId: user._id,
			ticketId: req.params.ticketId
		})

		res.status(201).json({
			message: 'Comment successfully posted.',
			content,
		})

		const { ticketId } = req.params;
		let doesTicketExist;
		try {
			doesTicketExist = await Ticket.findOne({ _id: ticketId });
		} catch (e) {
			// if ticketId incorrect
			// will be error and ticket will be undefined
			console.log(e.message);
		}

		if (!doesTicketExist) {
			res.status(404).json({
				error: 'Not Found',
				errorMes: 'No ticket with such ID.',
			});
			return;
		}

		const ticketComments = await Comment.find(
			{ ticketId: ticketId },
			'content date userId'
		);

		res.send(ticketComments);
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message,
		});
	};

}

exports.addToShoppingCard = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] })
		// ticket well be in req.ticket after middleware  

		user.shoppingCard.push({
			ticketId: req.params.ticketId,
			ticketName: req.ticket.name,
			price: req.ticket.price
		})
		user.save()

		res.json({
			message: 'The ticket has been successfully added to your Shopping Card.'
		})
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
		});
	};

}

exports.likeTicket = async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		const userId = req.headers['profile-id'];
		ticket.likes = ticket.likes.filter(
			(like) => like.userId.toString() !== userId.toString()
		);
		ticket.likes.push({ userId });
		await ticket.save();
		res.status(200).json({
			status: 'success',
			data: {
				ticket,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
}

exports.getTicketDetails = async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			res.status(404).json({
				status: 'fail',
				message: 'No ticket with such ID.',
			});
			return;
		}
		// get ticket details without userId
		const { _id, name, description, date, price } = ticket;
		const ticketDetails = {
			_id,
			name,
			description,
			date,
			price,
			likeCount: ticket.likes.length,
		};

		res.status(200).json({
			status: 'success',
			data: {
				ticketDetails,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
}

exports.buyTicket = async (req, res) => {
	try {
		const { id } = req.params;
		const ticket = await Ticket.findById(id);
		if (!ticket) {
			res.status(404).json({
				status: 'fail',
				message: 'No ticket with such ID.',
			});
			return;
		}
		if (ticket.quantity === 0) {
			res.status(404).json({
				status: 'fail',
				message: 'No tickets left.',
			});
			return;
		}
		const user = await User.findById(req.headers['profile-id']);
		const { coins } = user;
		const { price } = ticket;
		if (coins < price) {
			res.status(400).json({
				status: 'fail',
				message: 'Not enough coins.',
			});
			return;
		}
		user.coins -= price;
		await user.save();
		const ticketOwner = await User.findById(ticket.userId);
		ticketOwner.coins += price;
		await ticketOwner.save();
		ticket.quantity -= 1;
		await ticket.save();
		const userOrders = await Order.findOne({ userId: user._id });
		if (!userOrders) {
			console.log('No orders');
			const newOrder = new Order({
				userId: user._id,
				ordersList: [
					{
						order: [ticket._id],
					},
				],
			});
			await newOrder.save();
		} else {
			console.log('userOrders', userOrders);
			userOrders.ordersList[userOrders.ordersList.length] = {
				order: [ticket._id],
			};
			await userOrders.save();
		}
		res.status(200).json({
			status: 'success',
			data: {
				ticket,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};
