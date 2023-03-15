const Post = require('../../models/Post')

const addCount = async (req, res, next) => {
	const { id } = req.query
	let post = await Post.findByIdAndUpdate(id, {$inc: {'count': 1}}).exec()
}

exports.addCount = addCount