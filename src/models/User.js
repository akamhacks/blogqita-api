const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: "firstName is required",
		minlength: 4,
		maxlength: 10,
		unique: "firstName must be unique"
	},
	name: {
		type: String,
		required: "Name is required",
		minlength: 4
	},
	email: {
		type: String,
	    trim: true,
	    unique: 'Email already exists',
	    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
	    required: 'Email is required'
	},
	password: {
		type: String,
		required: "Password is required",
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	verificationToken: String,
	verificationExpires: {
		type: Date,
		default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) // 1 days
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	isSettinged: {
		type: Boolean,
		default: false
	},
	isWriter: {
		type: Boolean,
		default: false
	},
	image: {
		type: String,
		required: true,
		default: 'uploads/defaultuser.png'
	},
	bio: {
		type: String,
		maxlength: 1000,
	},
	socialsAccounts: {
		"whatsapp": String,
		"instagram": String,
		"github": String,
		"facebook": String,
		"youtube": String,
		"tiktok": String,
		"telegram": String,
		"twitter": String,
		"linkedin": String,
		"snapchat": String,
		"discord": String,
		"pinterest": String,
		"reddit": String
	},
	following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
	followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
	posts: [{type: mongoose.Schema.ObjectId, ref: 'Post'}]
}, {
	timestamps: true
})

const UserModel = model('User', UserSchema)

module.exports = UserModel