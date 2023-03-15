const express = require('express');
const emojis = require('./emojis');
const auth = require('./auth')
const post = require('./post')
const respond = require('./respond')
const user = require('./user')
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: '﷽',
  });
});

router.use('/emojis', emojis);
router.use('/auth', auth)
router.use('/post', post)
router.use('/respond', respond)
router.use('/user', user)

module.exports = router;
