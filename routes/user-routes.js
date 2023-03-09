const express = require('express')
const router = express.Router()
const { verifyToken } = require('../controllers/auth-controllers')
const { getProfile, setProfile, followUnfollowHandler, getAuthors } = require('../controllers/user-controllers')
const { uploadMiddleware } = require('../controllers/post-controllers')

router.get('/profile', verifyToken, getProfile)
router.get('/authors', getAuthors)
router.put('/profile', verifyToken, uploadMiddleware.single('file'), setProfile)
router.put('/author', verifyToken, followUnfollowHandler)

module.exports = router