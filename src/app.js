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
app.use(function(req, res, next) {
var allowedOrigins = [
  "https://blogqita-client.vercel.app"
];
var origin = req.headers.origin;
console.log(origin)
console.log(allowedOrigins.indexOf(origin) > -1)
// Website you wish to allow to
if (allowedOrigins.indexOf(origin) > -1) {
  res.setHeader("Access-Control-Allow-Origin", origin);
}

// res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

// Request methods you wish to allow
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, OPTIONS, PUT, PATCH, DELETE"
);

// Request headers you wish to allow
res.setHeader(
  "Access-Control-Allow-Headers",
  "X-Requested-With,content-type,Authorization"
);

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader("Access-Control-Allow-Credentials", true);

// Pass to next layer of middleware
next();

});
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
