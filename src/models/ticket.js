const { Schema, model } = require('mongoose');

const ticketSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		name: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
		initialQuantity: { type: Number },
		canCancel: { type: Boolean, default: false },
		cancelDate: { type: Date },
		countries: [{ type: String, _id: false }],
		likes: [{ userId: {type: Schema.Types.ObjectId, ref: 'User'}, _id: false }]
	},
	{ collection: 'tickets', strict: false }
);

module.exports = model('Ticket', ticketSchema);
