const express = require('express');
const {
  createListing,
  getAllListings,
  updateListingStatus,
  getListingById,
  deleteListing
} = require('../controllers/listingController');
const { protect } = require('../controllers/authController');

const router = express.Router();

//protect all route
router.use(protect);
router.route('/').post(createListing).get(getAllListings);
router.route("/:id").get(getListingById).delete(deleteListing);

router.route('/:id/status').patch(updateListingStatus);

module.exports = router;
