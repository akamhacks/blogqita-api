const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const nameArr = file.originalname.split('.')
    const ext = nameArr[nameArr.length-1]
    cb(null, `${uniqueSuffix}.${ext}`)
  }
})
const uploadMiddleware = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } })

const Post = require('../../models/Post')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const createPost = async (req, res, next) => {
  const cookies = req.headers.cookie
  if(!cookies) {
    return res.status(404).json({ message: "No token found(token)" })
  }
  const token = cookies.split("=")[1]
  const { filename } = req.file

  if(token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
      if(err) throw err
      const { title, summary, content, tags, categories } = req.body

      const post = await Post.create({
        title,
        summary,
        content,
        cover: `uploads/${filename}`,
        author: info.id
      })
      const user = await User.findByIdAndUpdate(info.id, { $push: { posts: post._id } }, {new: true})
        .populate('following', '_id title image')
        .exec()
      res.status(200).json({ message: "Successfully upload", post })
    })
  }
}

const editPost = async (req, res, next) => {
  const cookies = req.headers.cookie
  if(!cookies) {
    return res.status(404).json({ message: "No token found(token)" })
  }
  const token = cookies.split("=")[1]
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if(err) throw err
    const { id } = req.query
    const { title, summary, content, categories, tags } = req.body
    const post = await Post.findById(id)
    if(req.file) {
      const { filename } = req.file
      fs.unlink(post.cover, (err) => {
        if (err) throw err;
        console.log('Previous Image Deleted');
      });
    }
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id)

    if(!isAuthor) {
      res.status(400).json({ message: "You are not author"})
    }
    const addedCategories = categories.split(", ")
    const addedTags = tags.split(", ")

    await post.updateOne({
      title,
      summary,
      content,
      categories: addedCategories,
      tags: addedTags,
      cover: filename ? `uploads/${filename}` : post.cover
    })
    res.status(200).json(post)
  })
}

exports.createPost = createPost
exports.editPost = editPost
exports.uploadMiddleware = uploadMiddleware