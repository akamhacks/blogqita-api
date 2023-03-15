const Post = require('../../models/Post')
const Respond = require('../../models/Respond')
const jwt = require('jsonwebtoken')

const addComment = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const { commentText } = req.body
		const { id } = req.query
		const post = await Post.findById(id)
		const latesComment = await Respond.findOne({depth: 1}).sort({createdAt:-1})
		if(!post) {
			return res.status(400).json({ message: "no post found" })
		} else if(!latesComment) {
			const respond = await Respond.create({
				postId: post._id,
				commenter: info.id,
				commentText,
				index: 1
			})
			return res.status(200).json(respond)
		}
		const index = latesComment.index + 1
		const respond = await Respond.create({
			postId: post._id,
			commenter: info.id,
			commentText,
			index
		})
		res.status(200).json(respond)
	})
}

const getComments = async (req, res, next) => {
	const { postId, id } = req.query
	if(postId) {
		const comments = await Respond.find({postId: {_id: postId}})
			.sort({ index: 1 })
			.populate("postId", "_id title")
			.populate("commenter", "_id name firstName image")
			.populate("parentId", "_id commenter")
			.exec()
		if(!comments) {
			return res.status(400).json({ message: "No post found"})
		}
		return res.status(200).json(comments)
	}else if(id) {
		const comment = await Respond.findById(id)
			.sort({ index: 1 })
			.populate("postId", "_id title")
			.populate("commenter", "_id name firstName image")
			.populate("parentId", "_id commenter")
			.exec()
		if(!comment) {
			return res.status(400).json({ message: "No comment found"})
		}
		return res.status(200).json(comment)
	}
}

const getCommenter = async (req, res, next) => {
	const { id } = req.query
	const user = await Respond.findById(id)
		.populate("commenter", "_id name firstName image")
	res.status(200).json(user)
}

const deleteComment = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const { id } = req.query
		const comment = await Respond.findById(id)
		isUserComment = JSON.stringify(comment.commenter._id) === JSON.stringify(info.id)
		if(!isUserComment) {
			return res.status(400).json({ message: "Invalid credentials \n You are not commenter", comment })
		}

		const respond = await Respond.findByIdAndDelete(id)
		const deletedRespond = await Respond.deleteMany({ parentId: id })
		res.status(200).json({message: `Comment with id: ${id} deleted`})
	})
}

const updateComment = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const { id } = req.query
		const { commentText } = req.body
		const comment = await Respond.findById(id)
		isUserComment = String(comment.commenter) === String(info.id)
		if(!isUserComment) {
			return res.status(400).json({ message: "Invalid credentials \n You are not commenter", comment })
		}

		const respond = await Respond.findByIdAndUpdate(id, { commentText })
		res.status(200).json({ message: "Success updated comment", respond })
	})
}

const likeDislikeCommentHandler = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		if(err) throw err
		const { id, like, dislike } = req.query
		const comment = await Respond.findById(id)
		const isCommentIsLiked = await comment.likes.includes(info.id)
		const isCommentIsDisliked = await comment.dislikes.includes(info.id)
		if(isCommentIsLiked) {
			 if(like === true) {
				return res.status(400).json({ message: "You have been liked this comment" })
			} else if(like === false) {
				await comment.updateOne({ $pull: {likes: info.id} })
				return res.status(200).json({ message: "You have been unliked this comment" })
			} else if(dislike === true) {
				await comment.updateOne({ $push: {dislikes: info.id}, $pull: {likes: info.id} })
				return res.status(200).json({ message: "You have been unliked and disliked this comment" })
			} else if(dislike === false) {
				await comment.updateOne({ $push: {likes: info.id}, $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been undisliked this comment" })
			} else {
				return res.status(400).json({ message: "Bad request" })
			}
		} else if(isCommentIsDisliked) {
			if(dislike === true) {
				return res.status(400).json({ message: "You have been disliked this comment" })
			} else if(dislike === false) {
				await comment.updateOne({ $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been undisliked this comment" })
			} else if(like === true) {
				await comment.updateOne({ $push: {likes: info.id}, $pull: {dislikes: info.id} })
				return res.status(200).json({ message: "You have been liked and undisliked this comment" })
			} else {
				return res.status(400).json({ message: "Bad request" })
			}
		}
		if(like === true) {
			await comment.updateOne({ $push: {likes: info.id} })
			return res.status(200).json({ message: "You have been liked this comment" })
		} else if(dislike === true) {
			await comment.updateOne({ $push: {dislikes: info.id} })
			return res.status(200).json({ message: "You have been disliked this comment" })
		} else {
			return res.status(400).json({ message: "Bad request" })
		}
	})
}

const replyComment = async (req, res, next) => {
	const cookies = req.headers.cookie
	if(!cookies) {
		return res.status(404).json({ message: "No token found" })
	}
	const token = cookies.split("=")[1]
	jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
		const { id } = req.query
		const { commentText } = req.body
		if(!commentText) {
			return res.status(400).json({ message: "reply must contains commentText" })
		}
		const comment = await Respond.findById(id)
			.populate("commenter", "_id name firstName")
		if(!comment) {
			return res.status(400).json({ message: "Comment not found" })
		}
		const depth = comment.depth + 1
		const latestComment = await Respond.findOne({ parentId: id }).sort({ createdAt: -1 })
		let index
		if(latestComment) {
			index = latestComment.index + Math.pow(10, comment.depth * -2)
			const respond = await Respond.create({
				postId: comment.postId,
				commenter: info.id,
				commentText,
				depth,
				parentId: id,
				index,
				replyTo: comment.commenter.firstName
			})
			return res.status(200).json({ replyComment: respond, parentComment: comment })
		}

		if(!latestComment){
			index = comment.index + Math.pow(10, comment.depth * -3)
			const respond = await Respond.create({
				postId: comment.postId,
				commenter: info.id,
				commentText,
				depth,
				parentId: id,
				index,
				replyTo: comment.commenter.firstName
			})
			return res.status(200).json({ replyComment: respond, parentComment: comment })
		}
	})
}

exports.addComment = addComment
exports.getComments = getComments
exports.getCommenter = getCommenter
exports.deleteComment = deleteComment
exports.updateComment = updateComment
exports.likeDislikeCommentHandler = likeDislikeCommentHandler
exports.replyComment = replyComment