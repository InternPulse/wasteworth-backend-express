const rateLimit = require("express-rate-limit");

const createLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message,
  keyGenerator,
  skip,
} = {}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message:
      message || "Too many requests from this IP, please try again later",
    ...(keyGenerator && { keyGenerator }),
    ...(typeof skip === "function" && { skip }),
  });

// Default global limiter (100 requests / 15 minutes)
const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Default auth limiter (5 requests / 1 minute)
// const authLimiter = createLimiter({
//   windowMs: 1 * 60 * 1000,
//   max: 5,
//   message: "Too many authentication attempts, please try again later",
// });

module.exports = {
  createLimiter,
  globalLimiter,
};
