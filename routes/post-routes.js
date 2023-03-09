const express = require('express')
const router = express.Router()
const { addCount, getPosts, getFeaturedPosts, getLatestPosts, getTags, getCategories, getAuthorPosts, searchPosts, getSinglePost, uploadMiddleware, createPost, editPost } = require('../controllers/post-controllers')
const { verifyToken } = require('../controllers/auth-controllers')

router.get('/posts', getPosts)
router.get('/post', getSinglePost, addCount)
router.get('/featured', getFeaturedPosts)
router.get('/latest-posts', getLatestPosts)
router.get('/tags', getTags)
router.get('/categories', getCategories)
router.get('/author', getAuthorPosts)
router.get('/search', searchPosts)
router.post('/post', verifyToken, uploadMiddleware.single('file'), createPost)
router.put('/post', verifyToken, uploadMiddleware.single('file'), editPost)

module.exports = router