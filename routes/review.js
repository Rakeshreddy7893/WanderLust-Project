const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {valiadateReview, isLoggedIn, isreviewAuthor} = require('../middleware.js')
const reviewController = require('../controllers/reviews.js')



router.post('/',isLoggedIn,valiadateReview,wrapAsync(reviewController.createReview))
   
router.delete('/:reviewId',isLoggedIn,isreviewAuthor,wrapAsync(reviewController.destroyReview))
   
module.exports = router;