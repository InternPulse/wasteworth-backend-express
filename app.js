const express = require('express');
const morgan = require('morgan');
const cookiesParser = require('cookie-parser');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const ListingRouter = require('./router/listingRouter');
const notificationRouter = require('./router/notificationRouter');
const { User } = require('./db/models');

//development-logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//body-parser
app.use(express.json());
app.use(cookiesParser());

//routes//
//-test-route
app.get('/api/v1/test', async (req, res) => {
  const user = await User.findAll();

  res.status(200).json({
    status: 'success',
    length: user.length,
    data: user,
  });
});

//main-routes
app.use('/api/v1/listings', ListingRouter);
app.use('/api/v1/notification', notificationRouter);

app.use((req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
