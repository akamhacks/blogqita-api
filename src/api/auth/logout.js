const jwt = require('jsonwebtoken')

const logout = async (req, res, next) => {
	const cookies = req.headers.cookie
	const prevToken = cookies.split("=")[1]
	if(!prevToken) {
		return res.status(400).json({ message: "Authentication failed.. try again"})
	}

	jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
		if(err) {
			console.log(err)
			return res.status(403).json({message: "Authentication failed"})
		}
		res.clearCookie(`${user.id}`)
		req.cookies[`${user.id}`] = ""

		return res.status(200).json({message: "Successfully Logged Out"})
	})
}

exports.logout = logout