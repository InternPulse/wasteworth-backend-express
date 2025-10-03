const express = require('express');
const {
  createListing,
  getAllListings,
  updateListingStatus,
  getListingById,
  deleteListing,
  getUserListingData,
} = require('../controllers/listingController');
const {
  protect,
  VerifyExternalAccess,
} = require('../controllers/authController');

const router = express.Router();

//protect all route
router.use(protect);
router.route('/').post(createListing).get(getAllListings);
router.get('/listingstats', VerifyExternalAccess, getUserListingData);
router
  .route('/:id')
  .get(getListingById)
  .delete(deleteListing)
  .patch(updateListingStatus);

module.exports = router;
