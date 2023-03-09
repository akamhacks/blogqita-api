const express = require('express')
const router = express.Router()
const { register, verifyEmail, login, requestResetPassword, resetPassword, logout, verifyToken } = require('../controllers/auth-controllers')

router.post('/register', register)
router.get('/verify', verifyEmail)
router.post('/login', login)
router.get('/reset', requestResetPassword)
router.post('/reset', resetPassword)
router.post('/logout', verifyToken, logout)

module.exports = router