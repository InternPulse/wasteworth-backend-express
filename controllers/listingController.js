const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Listing } = require("../db/models");

exports.createListing = catchAsync(async (req, res, next) => {
  try {
    const payload = {
      waste_type: req.body.waste_type,
      quantity: req.body.quantity,
      reward_estimate: req.body.reward_estimate,
      final_reward: req.body.final_reward,
      pickup_location: req.body.pickup_location,
      user_id_id: req.body.user_id_id,
      collector_id_id: req.body.collector_id_id,
    };

    const listing = await Listing.create(payload);
    console.log("Listing created successfully:", listing.toJSON());

    res.status(201).json({
      status: "success",
      data: listing,
    });
  } catch (err) {
    console.error("Error in createListing:", err);
    return next(new AppError(err.message, 500));
  }
});

exports.getAllListings = catchAsync(async (req, res, next) => {
  try {
    const listings = await Listing.findAll();

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

exports.updateListingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ["pending", "accepted", "in-progress", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return next(
        new AppError(`Invalid status. Allowed values: ${allowedStatuses.join(", ")}`, 400)
      );
    }

    const listing = await Listing.findByPk(id);
    if (!listing) {
      console.warn(`⚠️ Listing with id ${id} not found`);
      return next(new AppError("Listing not found", 404));
    }

    listing.status = status;
    await listing.save();


    res.status(200).json({
      status: "success",
      message: `Listing status updated to '${status}'`,
      data: {
        id: listing.id,
        status: listing.status,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
});
