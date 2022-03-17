const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'users' },
		ordersList: [
			{
				order: [
					{ type: Schema.Types.ObjectId, ref: 'tickets', _id: false },
				],
				date: { type: Date, default: Date.now() },
				_id: false,
			},
		],
	},
	{ collection: 'orders', strict: false }
);

orderSchema.index({ userId: 1 }, { unique: true });

module.exports = model('Order', orderSchema);
