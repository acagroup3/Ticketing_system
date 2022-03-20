const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
	{
		content: { type: String, required: true },
		date: { type: Date, default: Date.now() },
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket' },
	},
	{ collection: 'comments', strict: false }
);

commentSchema.index({ ticketId: 1 }, { unique: true });

module.exports = model('Comment', commentSchema);
