const User = require('../../models/User')

const getAuthors = async (req, res, next) => {
	const author = await User.find({ isVerified: true }, "-password")
	return res.status(200).json(author)
}

exports.getAuthors = getAuthors