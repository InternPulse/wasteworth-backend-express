const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { User } = require('../db/models');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError('You are not logged in!, please login to get Access', 401)
    );

  //decode token\
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  //check if user still exist
  const user = await User.findByPk(decoded.user_id);
  if (!user)
    return next(
      new AppError('The user belonginf to this token does not exist', 401)
    );
  //check if user is verified
  if (!user.is_verified)
    return next(new AppError('user not verified, verify to gain access', 401));

  //grant access to protected route
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

exports.VerifyExternalAccess = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.api_key && req.headers.api_key.startsWith('Bearer')) {
    token = req.headers.api_key.split(' ')[1];
  }
  console.log(token);

  if (!token)
    return next(new AppError('Please provide an API_KEY to continue', 401));

  if (token !== process.env.INTERNAL_API_KEY)
    return next(new AppError('Wrong API_KEY, access denied', 401));

  next();
});
