const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const verifyToken = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found (cookies)" })
	}
	const token = cookies.split("=")[1]
	if(!token) {
		return res.status(404).json({ message: "No token found (token)" })
	}
	jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
		if(err) {
			return res.status(400).json({ message: "Invalid token", token })
		}
		req.id = user.id
	})
	next()
}

exports.verifyToken = verifyToken