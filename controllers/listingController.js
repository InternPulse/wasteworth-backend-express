const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Listing } = require('../db/models');

exports.createListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.create(req.body);

  res.status(201).json({
    status: 'succces',
    data: listing,
  });
});
