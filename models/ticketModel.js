const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A ticket must have a name'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	date: {
		type: Date,
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	price: {
		type: Number,
		required: [true, 'A ticket must have a price'],
	},
	canCancel: {
		type: Boolean,
		default: true,
	},
	cancelData: {
		type: Date,
	},
	countries: [String],
	userId: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Profile',
		},
	],
});
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
