const Post = require('../../models/Post')

const getCategories = async (req, res, next) => {
	const { id } = req.query
	if(!id) {
		const categories = await Post.find({}, "categories")
		return res.status(200).json(categories)
	} else {
		const posts = await Post.find({ categories: id})
			.populate('author', ['name'])
			.sort({ count: -1 })
			.limit(20)
		if(!posts) {
			res.status(404).json({ message: `Tags ${ id } Not Found`})
		}
		return res.status(200).json(posts)
	}
}

exports.getCategories = getCategories