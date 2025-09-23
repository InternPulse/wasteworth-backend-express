const express = require('express');
const {
  getAllMarketPlaceListing,
  acceptListing,
} = require('../controllers/marketPlaceController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);
router.route('/').get(restrictTo('collector'), getAllMarketPlaceListing);
router.patch('/:listingID', restrictTo('collector'), acceptListing);

module.exports = router;
