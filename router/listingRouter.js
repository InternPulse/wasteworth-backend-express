const express = require('express');
const {
  createListing,
  getAllListings,
  updateListingStatus,
} = require('../controllers/listingController');

const router = express.Router();

router.route('/').post(createListing).get(getAllListings);

router.route('/:id/status').patch(updateListingStatus);

module.exports = router;
