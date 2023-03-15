const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const middlewares = require('./middlewares');
const api = require('./api');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const boolParser = require('express-query-boolean')
const path = require('path')
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
// app.use(cors({ credentials: true, origin: 'https://blogqita-client.vercel.app' }))
app.use(bodyParser.json())
app.use(boolParser())
app.use(cookieParser())
app
  .use(function(req, res, next){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
  })
  .options('*', function(req, res, next){
      res.end();
  })
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
  res.json({
    message: '﷽',
  });
});
app.use('/api/v1', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
