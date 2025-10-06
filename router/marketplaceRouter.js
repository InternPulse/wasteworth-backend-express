const express = require('express');
const {
  getAllMarketPlaceListing,
  acceptListing,
  getMyAcceptedListing,
} = require('../controllers/marketPlaceController');
const { protect, restrictTo } = require('../controllers/authController');
const { cache } = require('../Middleware/cache');

const router = express.Router();

router.use(protect);

router.route('/myAccepted')
  .get(cache(180), restrictTo('collector'), getMyAcceptedListing);

router.route('/')
  .get(cache(300), restrictTo('collector'), getAllMarketPlaceListing);

router.route('/:listingID')
  .patch(restrictTo('collector'), acceptListing);

module.exports = router;