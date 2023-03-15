const Post = require('../../models/Post')

const getSinglePost = async (req, res, next) => {
    const { id } = req.query
    const post = await Post.findById(id).populate('author', 'name socialsAccounts image bio posts')
    res.status(201).json({ post })
    next()
}

exports.getSinglePost = getSinglePost