const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const verifyEmail = async (req, res, next) => {
	const { token } = req.query
	if(!token || token === 'null') {
		return res.status(400).json({ message: "Error no token found" })
	}
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const user = await User.findByIdAndUpdate(info.id, { $set: { isVerified: true, image: 'uploads/default-user.png' } })
		if(!user) {
			return res.status(400).json({ message: "User not found please register again" })
		}
		return res.status(200).json({ message: "Successfully Verify Email", id: user._id, firstName: user.firstName, name: user.name, email: user.email, isVerified: user.isVerified })
	})
}

exports.verifyEmail = verifyEmail