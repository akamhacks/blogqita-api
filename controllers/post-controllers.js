const Post = require('../models/Post')
const User = require('../models/User')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const nameArr = file.originalname.split('.')
    const ext = nameArr[nameArr.length-1]
    cb(null, `${uniqueSuffix}.${ext}`)
  }
})
const uploadMiddleware = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } })

const getPosts = async (req, res, next) => {
	const { page } = req.query
	const posts = await Post.find(req.query, "-content")
		.populate('author', ['name'])
		.sort({ count: -1 })
		.limit(20)
		.skip(page>1 && (page - 1) * 20)
	return res.status(200).json(posts)
}

const getFeaturedPosts = async (req, res, next) => {
	const posts = await Post.find({})
		.populate('author', ['name'])
		.sort({ count: -1 })
		.limit(7)
	return res.status(200).json(posts)
}

const getLatestPosts = async (req, res, next) => {
	const posts = await Post.find({})
		.populate('author', ['name'])
		.sort({ createdAt: -1 })
		.limit(4)
	return res.status(200).json(posts)
}

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

const getAuthorPosts = async (req, res, next) => {
	const { id } = req.query
	const posts = await Post.find({ author: id})
		.populate('author', ['name'])
		.sort({ count: -1 })
	const author = await User.findById(id)
	if(!posts) {
		res.status(404).json({ message: `Tags ${ id } Not Found`})
	}
	res.status(200).json({ posts: posts, author: author})
}

const getPostsLength = async (req, res, next) => {
	const posts = await Post.find()
	const authorId = posts.map(post => post.author)
	res.json(authorId)
}

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

const getSinglePost = async (req, res, next) => {
	const { id } = req.query
	const post = await Post.findById(id).populate('author', 'name socialsAccounts image bio posts')
	res.status(201).json({ post })
	next()
}

const addCount = async (req, res, next) => {
	const { id } = req.query
	let post = await Post.findByIdAndUpdate(id, {$inc: {'count': 1}}).exec()
}

const createPost = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]
	const { filename } = req.file

	if(token) {
		jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
			if(err) throw err
			const { title, summary, content, tags, categories } = req.body
			const post = await Post.create({
				title,
				summary,
				content,
				cover: `uploads/${filename}`,
				author: info.id
			})
			const user = await User.findByIdAndUpdate(info.id, { $push: { posts: post._id } }, {new: true})
				.populate('following', '_id title image')
				.exec()
			res.status(200).json({ message: "Successfully upload", post })
		})
	}
}

const editPost = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { id } = req.query
		const { title, summary, content, categories, tags } = req.body
		const post = await Post.findById(id)
		if(req.file) {
			const { filename } = req.file
			fs.unlink(post.cover, (err) => {
				if (err) throw err;
				console.log('Previous Image Deleted');
			});
		}
		const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id)

		if(!isAuthor) {
			res.status(400).json({ message: "You are not author"})
		}
		const addedCategories = categories.split(", ")
		const addedTags = tags.split(", ")

		await post.updateOne({
			title,
			summary,
			content,
			categories: addedCategories,
			tags: addedTags,
			cover: filename ? `uploads/${filename}` : post.cover
		})
		res.status(200).json(post)
	})
}

exports.addCount = addCount
exports.getPosts = getPosts
exports.getFeaturedPosts = getFeaturedPosts
exports.getLatestPosts = getLatestPosts
exports.getPostsLength = getPostsLength
exports.getTags = getTags
exports.getCategories = getCategories
exports.getAuthorPosts = getAuthorPosts
exports.searchPosts = searchPosts
exports.getSinglePost = getSinglePost
exports.uploadMiddleware = uploadMiddleware
exports.createPost = createPost
exports.editPost = editPost