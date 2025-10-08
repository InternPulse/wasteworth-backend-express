const express = require('express');
const {
  getAllMarketPlaceListing,
  acceptListing,
  getMyAcceptedListing,
} = require('../controllers/marketPlaceController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);
router.route('/').get(restrictTo('recycler'), getAllMarketPlaceListing);
router.route('/myAccepted').get(getMyAcceptedListing);
router.patch('/:listingID', restrictTo('recycler'), acceptListing);

module.exports = router;
