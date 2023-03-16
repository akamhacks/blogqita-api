const app = require('./app');
const mongoose = require('mongoose')

const port = process.env.PORT || 5000;
const localhost = process.env.LOCALHOST || '0.0.0.0'

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mern-blog.mhkeity.mongodb.net/?retryWrites=true&w=majority`).then(() => {
        app.listen(port, localhost)
        console.log(`Database is connected! Listening to http://${localhost}:${port}`)
    }).catch(err => console.log(err))