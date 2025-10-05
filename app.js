const express = require("express");
const morgan = require("morgan");
const cookiesParser = require("cookie-parser");
const app = express();
const { globalLimiter} = require("./config/rateLimiter");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const ListingRouter = require("./router/listingRouter");
const MarketPlaceRouter = require("./router/marketplaceRouter");
const notificationRouter = require("./router/notificationRouter");
const { protect, restrictTo } = require("./controllers/authController");

//development-logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body-parser
app.use(express.json());
app.use(cookiesParser());

// If your app is behind a proxy (e.g. Heroku, Nginx), enable trust proxy
// so express-rate-limit and other middleware can retrieve the client's IP correctly.
app.set("trust proxy", 1);

// Apply global rate limiter to all requests
app.use(globalLimiter);

//routes//
app.use("/api/v1/listings", ListingRouter);
app.use("/api/v1/marketplace/listings", MarketPlaceRouter);
app.use("/api/v1/notifications", notificationRouter);

app.use((req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
