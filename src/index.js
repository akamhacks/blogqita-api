const app = require('./app');
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 4000;
const localhost = process.env.LOCALHOST || '0.0.0.0'

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://${localhost}:${port}`);
  /* eslint-enable no-console */
});

mongoose.connect(`mongodb+srv://musthafa:${process.env.MONGODB_PASSWORORD}@mern-blog.mhkeity.mongodb.net/?retryWrites=true&w=majority`).then(() => {
  app.listen(port, localhost)
  console.log(`Database is connected! Listening to http://${localhost}:${port}`)
}).catch(err => console.log(err))