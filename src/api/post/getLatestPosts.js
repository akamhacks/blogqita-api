const Post = require('../../models/Post')

const getLatestPosts = async (req, res, next) => {
	const posts = await Post.find({})
		.populate('author', ['name'])
		.sort({ createdAt: -1 })
		.limit(4)
	return res.status(200).json(posts)
}

exports.getLatestPosts = getLatestPosts