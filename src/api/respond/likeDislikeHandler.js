const Post = require('../../models/Post')
const jwt = require('jsonwebtoken')

const likeDislikeHandler = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(400).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	if(!token) {
		return res.status(400).json({ message: "No token Found" })
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { id, like, dislike } = req.query
		const post = await Post.findById(id)
		const isPostLiked = await post.likes.includes(info.id)
		const isPostDisliked = await post.dislikes.includes(info.id)
		if(isPostLiked) {
			 if(like === true) {
				return res.status(400).json({ message: "You have been liked this post" })
			} else if(like === false) {
				await post.updateOne({ $pull: {likes: info.id} })
				return res.status(200).json({ message: "You have been unliked this post" })
			} else if(dislike === true) {
				await post.updateOne({ $push: {dislikes: info.id}, $pull: {likes: info.id} })
				return res.status(200).json({ message: "You have been unliked and disliked this post" })
			} else if(dislike === false) {
				await post.updateOne({ $push: {likes: info.id}, $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been undisliked this post" })
			} else {
				return res.status(400).json({ message: "Bad request" })
			}
		} else if(isPostDisliked) {
			if(dislike === true) {
				return res.status(400).json({ message: "You have been disliked this post" })
			} else if(dislike === false) {
				await post.updateOne({ $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been undisliked this post" })
			} else if(like === true) {
				await post.updateOne({ $push: {likes: info.id}, $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been liked and undisliked this post" })
			} else {
				return res.status(400).json({ message: "Bad request" })
			}
		}
		if(like === true) {
			await post.updateOne({ $push: {likes: info.id} })
			return res.status(200).json({ message: "You have been liked this post" })
		} else if(dislike === true) {
			await post.updateOne({ $push: {dislikes: info.id} })
			return res.status(200).json({ message: "You have been disliked this post" })
		} else {
			return res.status(400).json({ message: "Bad request" })
		}
	})
}

exports.likeDislikeHandler = likeDislikeHandler