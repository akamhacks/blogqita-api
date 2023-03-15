const Post = require('../../models/Post')

const searchPosts = async (req, res, next) => {
	if(req?.query?.title || req?.query?.title === '' || req?.query?.content) {
		const { title, content } = req.query
		if(title || title === '') {
			req.query.title = { $regex: title, $options: "i" }
		} else if(content) {
			req.query.content = { $regex: content, $options: "i" }
		}
		const posts = await Post.find(req.query)
			.populate('author', ['name'])
			.sort({ count: -1 })
			.limit(20)
		return res.status(200).json(posts)
	} else if(req?.query?.tags || req?.query?.categories) {
		const { tags, categories } = req.query
		if(tags) {
			req.query.tags = { $all: tags.split(' ') }
		} else if(categories) {
			req.query.categories = { $all: categories.split(' ') }
		}
		const posts = await Post.find(req.query)
			.populate('author', ['name'])
			.sort({ count: -1 })
			.limit(20)
		if(posts < 1) {
			res.json({message: "no posts found"})
		}
		return res.status(200).json(posts)
	}
}

exports.searchPosts = searchPosts