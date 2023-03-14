const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./models/User')
const Post = require('./models/Post')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const boolParser = require('express-query-boolean')
const multer = require('multer')
const authRouter = require('./routes/auth-routes')
const userRouter = require('./routes/user-routes')
const postRouter = require('./routes/post-routes')
const respondRouter = require('./routes/respond-routes')
const { addCount } = require('./controllers/post-controllers')

app.use(cors({credentials: true, origin: '*'}))
app.use(express.json())
app.use(bodyParser.json())
app.use(boolParser())
app.use(cookieParser()) 
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', authRouter)
app.use('/api', respondRouter)

const port = process.env.NODEJS_PORT || 4000
const localhost = '0.0.0.0'

mongoose.connect(`mongodb+srv://musthafa:${process.env.MONGODB_PASSWORORD}@mern-blog.mhkeity.mongodb.net/?retryWrites=true&w=majority`).then(() => {
	app.listen(port, localhost)
	console.log(`Database is connected! Listening to http://${localhost}:${port}`)
}).catch(err => console.log(err))

// connect to mongoshell
// mongosh "mongodb+srv://mern-blog.mhkeity.mongodb.net/myFirstDatabase" --apiVersion 1 --username musthafa
// 7WCf12zcyLtSWgFX