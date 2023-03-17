const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const getProfile = async (req, res, next) => {
	const cookies = req.headers.cookie
	console.log(req.headers)
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	let id;
	id = req.query.id
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(!req?.query?.id) {
			id = info.id
		}
		const user = await User.findById(id)
		return res.status(200).json({ user })
		
	})
}

exports.getProfile = getProfile