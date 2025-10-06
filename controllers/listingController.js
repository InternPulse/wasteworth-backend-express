const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Listing, MarketplaceListing, User } = require("../db/models");
const { clearCache, clearCacheKey } = require('../Middleware/cache');

exports.createListing = catchAsync(async (req, res, next) => {
  const payload = {
    waste_type: req.body.waste_type,
    quantity: req.body.quantity,
    reward_estimate: req.body.reward_estimate,
    final_reward: req.body.final_reward,
    pickup_location: req.body.pickup_location,
    user_id_id: req.user.id,
    collector_id_id: req.body.collector_id_id,
    image_url: req.file ? req.file.path : null,
    title: req.body.title, 
    phone: req.body.phone,
  };

  const listing = await Listing.create(payload);
  if (!listing) return next(new AppError("Error creating listing", 500));

  // create a market place listing, if listing is successful
  const marketplace_listing = await MarketplaceListing.create({
    listing_id_id: listing.id,
  });

  if (!marketplace_listing)
    return next(new AppError("Error creating marketplaceListing", 500));

// Clear relevant caches
  try {
    await clearCacheKey(`cache:/api/v1/listings:${req.user.id}`); // getAllListings
    await clearCacheKey(`cache:/api/v1/listings/${listing.id}:${req.user.id}`); // getListingById
    await clearCacheKey(`cache:/api/v1/listings/listingstats:${req.user.id}`); // getUserListingData
    await clearCache('cache:/api/v1/marketplace*'); // Marketplace listings
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }

  res.status(201).json({
    status: "success",
    data: listing,
  });
});

exports.getAllListings = catchAsync(async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        user_id_id: req.user.id,
      },
    });

    res.status(200).json({
      status: "success",
      results: listings.length,
      data: listings,
    });
  } catch (err) {
    console.error("Error in getAllListings:", err);
    return next(new AppError(err.message, 500));
  }
});

exports.getListingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findByPk(id, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: User,
        as: "collector",
        attributes: ["id", "name", "email", "phone"],
      },
    ],
  });

  if (!listing) {
    return next(new AppError("No listing found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

exports.deleteListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  //delete from listing & marketplace table
  const listing = await Listing.findByPk(id);
  const marketplace = await MarketplaceListing.findOne({
    where: {
      listing_id_id: id,
    },
  });

  if (!listing) {
    return next(new AppError("No listing found with that ID", 404));
  }

  if (!marketplace) {
    return next(new AppError("No marketplace found with that ID", 404));
  }
  
  await marketplace.destroy();
  await listing.destroy();

  // Clear relevant caches
  try {
    await clearCacheKey(`cache:/api/v1/listings:${req.user.id}`);
    await clearCacheKey(`cache:/api/v1/listings/${id}:${req.user.id}`);
    await clearCacheKey(`cache:/api/v1/listings/listingstats:${req.user.id}`);
    await clearCache('cache:/api/v1/marketplace*');
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateListingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.query;

  const allowedStatuses = [
    "pending",
    "accepted",
    "in-progress",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return next(
      new AppError(
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        400
      )
    );
  }

  const listing = await Listing.findByPk(id);
  if (!listing) {
    return next(new AppError("Listing not found", 404));
  }

  listing.status = status;
  await listing.save();

  // Clear relevant caches
  try {
    await clearCacheKey(`cache:/api/v1/listings:${req.user.id}`);
    await clearCacheKey(`cache:/api/v1/listings/${id}:${req.user.id}`);
    await clearCacheKey(`cache:/api/v1/listings/listingstats:${req.user.id}`);
    await clearCache('cache:/api/v1/marketplace/listings*');
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }

  res.status(200).json({
    status: "success",
    message: `Listing status updated to: '${status}'`,
    data: {
      id: listing.id,
      status: listing.status,
    },
  });
});

exports.getUserListingData = catchAsync(async (req, res, next) => {
  const listingdata = await Listing.findAll({
    where: { user_id_id: req.user.id },
  });
  
  const totalcompletedlisting = await Listing.findAll({
    where: {
      user_id_id: req.user.id,
      status: "completed",
    },
  });
  
  const recentListing = await Listing.findAll({
    where: {
      user_id_id: req.user.id,
    },
    order: [['created_at', 'DESC']],
    limit: 5,
  });
  
  res.status(200).json({
    total_waste_posted: listingdata.length,
    total_waste_completed: totalcompletedlisting.length,
    recent_listing: recentListing,
  });
});