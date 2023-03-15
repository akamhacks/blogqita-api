const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const resetPassword = async (req, res, next) => {
	const { token } = req.query
	const { password } = req.body

	if(!token) {
		return res.status(400).json({ message: "No token found" })
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const hashedPassword = bcrypt.hashSync(password, salt)
		const user = await User.findByIdAndUpdate(info.id, { $set: {password: hashedPassword} })
		if(!user) {
			return res.status(400).json({ message: "invalid Credentials"})
		}
		res.status(200).json({ message: "Successfully Change password" })
	})
}

exports.resetPassword = resetPassword