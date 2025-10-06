const express = require('express');
const morgan = require('morgan');
const cookiesParser = require('cookie-parser');
const helmet = require('helmet')
const cors = require('cors')
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

// CORS and Security
const corsOptions = {
  origin: ['https://wasteworth-backend-django.onrender.com'],
  metthods: ['GET', 'POST', 'PUT', 'DELETE'],
  Headers: ['Content-Type', 'Authorization']
}

app.use(helmet())
app.use(cors(corsOptions))
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
