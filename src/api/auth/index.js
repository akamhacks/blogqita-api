const express = require('express')
const router = express.Router()

const { register } = require('./register')
const { verifyEmail } = require('./verifyEmail')
const { login } = require('./login')
const { requestResetPassword } = require('./requestResetPassword')
const { resetPassword } = require('./resetPassword')
const { verifyToken } = require('./verifyToken')
const { logout } = require('./logout')

router.post('/register', register)
router.get('/verify', verifyEmail)
router.post('/login', login)
router.get('/reset', requestResetPassword)
router.post('/reset', resetPassword)
router.post('/logout', verifyToken, logout)

module.exports = router