const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const multer = require('multer');
const Listing = require("../models/listing");
const {isLoggedIn, isOwner,valiadateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage})



router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),valiadateListing,wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),valiadateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;