const Post = require('../../models/Post')

const getTags = async (req, res, next) => {
	const { id } = req.query
	if(!id) {
		const tags = await Post.find({}, "tags")
		return res.status(200).json(tags)
	} else {
		const posts = await Post.find({ tags: id})
			.populate('author', ['name'])
			.sort({ count: -1 })
			.limit(20)
		if(!posts) {
			res.status(404).json({ message: `Tags ${ id } Not Found`})
		}
		return res.status(200).json(posts)
	}
}

exports.getTags = getTags