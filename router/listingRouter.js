const express = require('express');
const { createListing } = require('../controllers/listingController');

const router = express.Router();

router.route('/').post(createListing);

module.exports = router;
