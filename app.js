const express = require('express');
const morgan = require('morgan');
const cookiesParser = require('cookie-parser');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//development-logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//body-parser
app.use(express.json());
app.use(cookiesParser());

//routes//
//-test-route
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'working....',
  });
});

app.use((req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
