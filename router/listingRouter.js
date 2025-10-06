const express = require("express");
const {
  createListing,
  getAllListings,
  updateListingStatus,
  getListingById,
  deleteListing,
  getUserListingData,
} = require("../controllers/listingController");
const {
  protect,
  VerifyExternalAccess,
} = require("../controllers/authController");
const upload = require("../config/multer");
const { cache } = require('../Middleware/cache');

const router = express.Router();

//protect all route
router.use(protect);
router
  .route("/")
  .post(upload.single("image_url"), createListing)
  .get(cache(300), getAllListings);

router.get("/listingstats", cache(300), VerifyExternalAccess, getUserListingData);

router
  .route("/:id")
  .get(cache(600) ,getListingById)
  .delete(deleteListing)
  .patch(updateListingStatus);

module.exports = router;
