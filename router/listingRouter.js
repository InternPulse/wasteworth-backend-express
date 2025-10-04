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

const router = express.Router();

//protect all route
router.use(protect);
router
  .route("/")
  .post(upload.single("image_url"), createListing)
  .get(getAllListings);
router.get("/listingstats", VerifyExternalAccess, getUserListingData);
router
  .route("/:id")
  .get(getListingById)
  .delete(deleteListing)
  .patch(updateListingStatus);

module.exports = router;
