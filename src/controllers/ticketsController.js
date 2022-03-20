const Ticket = require('../models/ticket');
const TicketFeatures = require('../utils/appFeatures');
const User = require('../models/user');

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
};
exports.likeTicket = async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		const userId = req.headers['profile-id'];
		ticket.like = ticket.like.filter(
			(like) => like.userId.toString() !== userId
		);
		ticket.like.push({ userId });
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
};

exports.getTicketDetails = async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		// get ticket details without userId
		const {
			_id,
			name,
			description,
			date,
			price,
			quantity,
			initialQuantity,
			cancelDate,
			countries,
		} = ticket;
		const ticketDetails = {
			_id,
			name,
			description,
			date,
			price,
			quantity,
			initialQuantity,
			cancelDate,
			countries,
			likeCount: ticket.likeCount.length,
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
};
