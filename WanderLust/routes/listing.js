const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema}= require('../schema.js')
const Listing = require("../models/listing");
const {isLoggedIn} = require('../middleware.js')

const valiadateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
      let errMsg = error.details.map((el)=>{el.message.join(",")});
      throw new ExpressError(400,errMsg)
    }
    else{
      next()
    }
  }

router.get('/',wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  }))
  
  
  router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
  })
  
  router.get('/:id',wrapAsync(async(req,res)=>{
     let{id} = req.params;
     const listing =await Listing.findById(id).populate("reviews")
     if(!listing){
      req.flash("error","Listing that you requested for does not exist!");
      res.redirect('/listings')
     }
     res.render("listings/show.ejs",{listing})
  }))

  router.post('/',isLoggedIn,valiadateListing,wrapAsync(async(req,res,next)=>{
    const newListing =new Listing (req.body.listing)  
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings') 
}))

router.get('/:id/edit',isLoggedIn,wrapAsync(async(req,res)=>{
  let{id} = req.params;
   const listing =await Listing.findById(id);
   if(!listing){
    req.flash("error","Listing that you requested for does not exist!");
    res.redirect('/listings')
   }
   res.render("listings/edit.ejs",{listing})
}))

router.put('/:id',isLoggedIn,valiadateListing,wrapAsync(async(req,res)=>{
  let{id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   req.flash("success","Listing Updated");
   res.redirect(`/listings/${id}`);
}))

router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
  let{id} = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing Deleted!");
  res.redirect("/listings");
}))

module.exports = router;