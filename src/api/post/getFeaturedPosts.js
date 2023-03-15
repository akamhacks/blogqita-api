const Post = require('../../models/Post')

const getFeaturedPosts = async (req, res, next) => {
	const posts = await Post.find({})
		.populate('author', ['name'])
		.sort({ count: -1 })
		.limit(7)
	return res.status(200).json(posts)
}

exports.getFeaturedPosts = getFeaturedPosts