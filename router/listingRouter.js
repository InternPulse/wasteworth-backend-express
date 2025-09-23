const express = require('express');
const {
  createListing,
  getAllListings,
  updateListingStatus,
} = require('../controllers/listingController');
const { protect } = require('../controllers/authController');

const router = express.Router();

//protect all route
router.use(protect);
router.route('/').post(createListing).get(getAllListings);

router.route('/:id/status').patch(updateListingStatus);

module.exports = router;
