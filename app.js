const express = require('express');
const morgan = require('morgan');
const cookiesParser = require('cookie-parser');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const ListingRouter = require('./router/listingRouter');
const MarketPlaceRouter = require('./router/marketplaceRouter');
const notificationRouter = require('./router/notificationRouter');
const { protect, restrictTo } = require('./controllers/authController');

//development-logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//body-parser
app.use(express.json());
app.use(cookiesParser());

//routes//
app.use('/api/v1/listings', ListingRouter);
app.use('/api/v1/marketplace/listings', MarketPlaceRouter);
app.use('/api/v1/notifications', notificationRouter);

app.use((req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
