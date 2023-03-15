const express = require('express');
const emojis = require('./emojis');
const auth = require('./auth')
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: '﷽',
  });
});

router.use('/emojis', emojis);
router.use('/auth', auth)

module.exports = router;
