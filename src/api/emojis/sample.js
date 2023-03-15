const getEmojis = async (req, res, next) => {
    res.json(['😀', '😳', '🙄']);
}

exports.getEmojis = getEmojis