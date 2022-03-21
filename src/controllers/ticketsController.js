const Ticket = require('../models/ticket');
const TicketFeatures = require('../utils/appFeatures');
const User = require('../models/user');
const Comment = require('../models/comment');
const Order = require('../models/order')

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
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'A server-side error occurred',
			errorMes: e.message
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
}

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
}

