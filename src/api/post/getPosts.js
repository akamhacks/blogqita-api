const Post = require('../../models/Post')

const getPosts = async (req, res, next) => {
    const { page } = req.query
    const posts = await Post.find({}, "-content")
        .populate('author', ['name'])
        .sort({ count: -1 })
        .limit(20)
        .skip(page > 1 && (page - 1) * 20)
    return res.status(200).json(posts)
}

exports.getPosts = getPosts