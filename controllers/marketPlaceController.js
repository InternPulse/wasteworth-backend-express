const catchAsync = require('../utils/catchAsync');
const { MarketplaceListing } = require('../db/models');
const { Listing } = require('../db/models');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');

exports.getAllMarketPlaceListing = catchAsync(async (req, res, next) => {
  const marketPlaceListings = await MarketplaceListing.findAll({
    where: {
      recycler_id_id: {
        [Op.eq]: null,
      },
    },
    include: {
      model: Listing,
      as: 'listing',
    },
  });
  res.status(200).json({
    status: 'success',
    length: marketPlaceListings.length,
    data: marketPlaceListings,
  });
});

exports.acceptListing = catchAsync(async (req, res, next) => {
  //1) find Listing by ID & update status
  const { listingID } = req.params;
  if (!listingID) return next(new AppError('Please provide an ID', 400));

  const listing = await Listing.findByPk(listingID);
  if (!listing)
    return next(new AppError('Listing belonging to this ID not found'));
  await listing.update({
    status: 'accepted',
    collector_id_id: req.user.id,
  });

  //2) update marketPlace listing Also
  const marketPlaceListing = await MarketplaceListing.findOne({
    where: {
      listing_id_id: {
        [Op.eq]: listingID,
      },
    },
  });
  await marketPlaceListing.update({
    recycler_id_id: req.user.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Listing Accepted',
  });
});
