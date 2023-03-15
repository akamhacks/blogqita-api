const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const sendResetPassword = require('./utils/sendResetPassword')

const requestResetPassword = async (req, res, next) => {
	const { email } = req.query
	if(!email) {
		return res.status(400).json({ message: "Error email field don't be null" })
	}
	const user = await User.findOne({ email: email })
	if(!user) {
		return res.status(400).json({ message: `Account with email ${email} not found, please register first!`})
	}
	const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
	const link = `http://${req.hostname}:3000/reset-form?token=${token}`
	await sendResetPassword(email, user?.name, link)
	res.status(200).json({ message: "reset password email has been sended, please check your email", link})
}

exports.requestResetPassword = requestResetPassword