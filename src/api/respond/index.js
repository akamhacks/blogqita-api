const express = require('express')
const router = express.Router()

const { verifyToken } = require('../auth/verifyToken')
const { likeDislikeHandler } = require('./likeDislikeHandler')
const { addComment, getComments, getCommenter, deleteComment, updateComment, likeDislikeCommentHandler, replyComment } = require('./commentHandlers')

router.post('/respond-post', verifyToken, likeDislikeHandler)
router.post('/comment', verifyToken, addComment)
router.get('/comments', getComments)
router.get('/commenter', getCommenter)
router.delete('/comment', verifyToken, deleteComment)
router.put('/comment', verifyToken, updateComment)
router.post('/respond-comment', verifyToken, likeDislikeCommentHandler)
router.put('/reply', verifyToken, replyComment)

module.exports = router