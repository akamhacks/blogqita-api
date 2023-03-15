const express = require('express')
const router = express.Router()

const { verifyToken } = require('../auth/verifyToken')
const { getProfile } = require('./getProfile')
const { getAuthors } = require('./getAuthors')
const { setProfile } = require('./setProfile')
const { followUnfollowHandler } = require('./followUnfollowHandler')
const { uploadMiddleware } = require('../post/uploadPost')

router.get('/profile', verifyToken, getProfile)
router.get('/authors', getAuthors)
router.put('/profile', verifyToken, uploadMiddleware.single('file'), setProfile)
router.put('/author', verifyToken, followUnfollowHandler)

module.exports = router