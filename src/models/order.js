const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		ordersList: [
			{
				order: [
					{ type: Schema.Types.ObjectId, ref: 'Ticket', _id: false },
				],
				totalPrice: { type: Number, required: true},
				date: { type: Date, default: Date.now() }
			},
		],
	},
	{ collection: 'orders', strict: false }
);

orderSchema.index({ userId: 1 }, { unique: true });

module.exports = model('Order', orderSchema);
