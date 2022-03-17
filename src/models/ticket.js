const { Schema, model } = require('mongoose');

const ticketSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'Users' },
		name: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
		initialQuantity: { type: Number },
		canCancel: { type: Boolean, default: false },
		cancelDate: { type: Date },
		countries: [{ type: String, _id: false }],
		likeCount: { type: Number, default: 0 },
		dislikeCount: { type: Number, default: 0 },
	},
	{ collection: 'tickets', strict: false }
);

module.exports = model('Ticket', ticketSchema);
