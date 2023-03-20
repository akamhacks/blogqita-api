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
app.use(bodyParser.json())
app.use(boolParser())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: ['https://blogqita-client.vercel.app', 'https://for-simulation.vercel.app', 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000', 'http://localhost:8000', 'http://localhost:8080', 'http://localhost:5173'] }))
app.use('/uploads', cors(), express.static(path.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
  res.json({
    message: '﷽',
  });
});
app.use('/api/v1', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
module.exports = app;
