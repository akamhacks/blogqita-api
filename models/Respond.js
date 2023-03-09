const mongoose = require('mongoose')
const { Schema, model } = mongoose

const RespondSchema = new Schema({
	postId: { type: Schema.Types.ObjectId, ref: 'Post' },
	// depth: {
	// 	type: Number,
	// 	default: 1
	// },
	depth: {
		type: Number,
		default: 1
	},
	index: {
		type: Number
	},
	replyTo: {
		type: String
	},
	parentId: { type: mongoose.Schema.ObjectId, ref: 'Respond'},
	commenter: { type: mongoose.Schema.ObjectId, ref: 'User' },
	commentText: {
		type: String,
		required: true
	},
	likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
	dislikes: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
}, {timestamps: true});

const RespondModel = model('Respond', RespondSchema)

module.exports = RespondModel