const express = require('express');
const {
  getAllMarketPlaceListing,
  acceptListing,
} = require('../controllers/marketPlaceController');

const router = express.Router();

router.route('/').get(getAllMarketPlaceListing);
router.patch('/:listingID', acceptListing);

module.exports = router;
