const Post = require('../../models/Post')
const User = require('../../models/User')

const getAuthorPosts = async (req, res, next) => {
	const { id } = req.query
	const posts = await Post.find({ author: id})
		.populate('author', ['name'])
		.sort({ count: -1 })
	const author = await User.findById(id)
	if(!posts) {
		res.status(404).json({ message: `Tags ${ id } Not Found`})
	}
	res.status(200).json({ posts: posts, author: author})}

exports.getAuthorPosts = getAuthorPosts