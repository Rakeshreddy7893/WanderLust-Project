const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {valiadateReview, isLoggedIn, isreviewAuthor} = require('../middleware.js')


router.post('/',isLoggedIn,valiadateReview,wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = req.user._id
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
   res.redirect(`/listings/${listing._id}`);
}))
   
router.delete('/:reviewId',isLoggedIn,isreviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
   res.redirect(`/listings/${id}`)
}))
   
module.exports = router;