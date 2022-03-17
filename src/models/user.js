const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		country: { type: String, required: true },
		email: { type: String, require: true },
		password: { type: String, required: true },
		isVerified: { type: Boolean, default: false },
		coins: { type: Number },
		accessToken: { type: String },
		refreshToken: { type: String },
		shoppingCard: [
			{
				ticketId: { type: Schema.Types.ObjectId, ref: 'Tickets' },
				ticketName: String,
				price: Number,
				_id: false,
			},
		],
	},
	{ collection: 'users', strict: false }
);

module.exports = model('User', userSchema);
