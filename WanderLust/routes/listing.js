const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
// const ExpressError = require('../utils/ExpressError.js')
// const {listingSchema}= require('../schema.js')
const Listing = require("../models/listing");
const {isLoggedIn, isOwner,valiadateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js')


router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,valiadateListing,wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,valiadateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;