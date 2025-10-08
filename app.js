const express = require('express');
const morgan = require('morgan');
const cookiesParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const AppError = require('./utils/appError');
const { globalLimiter } = require('./config/rateLimiter');
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
  origin: [
    'http://localhost:5173',
    'https://wasteworth-backend-django.onrender.com',
    'https://wastewhat.vercel.app',
    'https://www.wasteworth.com.ng',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
//body-parser
app.use(express.json());
app.use(cookiesParser());

// Apply global rate limiter to all requests
app.use(globalLimiter);

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
