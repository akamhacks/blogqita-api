const Post = require('../../models/Post')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const deletePost = async (req, res, next) => {
	const { id } = req.query
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found(token)" })
	}
	const token = cookies.split("=")[1]

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const post = await Post.findById(id)
		const isAuthor = JSON.stringify(info.id) === JSON.stringify(post.author)
		if(isAuthor) {
			await post.deleteOne()
		}
		res.status(200).json({ message: "Successfully delete post", post })
	})
}

exports.deletePost = deletePost