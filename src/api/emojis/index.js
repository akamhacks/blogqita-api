const express = require('express');
const { getEmojis } = require('./sample')

const router = express.Router();

router.get('/', getEmojis);

module.exports = router;
