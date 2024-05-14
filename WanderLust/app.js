const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing")
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema,reviewSchema}= require('./schema.js')
const Review = require("./models/review.js")


app.set('view engine',"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then((res)=>{
    console.log("Connection is sucessful");
})

.catch((err)=>{
    console.log(err)
})
async function main(){
  await mongoose.connect(MONGO_URL)
}

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


const valiadateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body)
  if(error){
    let errMsg = error.details.map((el)=>{el.message.join(",")});
    throw new ExpressError(400,errMsg)
  }
  else{
    next()
  }
}

app.listen(8080,()=>{
console.log("server is listening to port:8080");
})

app.get('/listings',wrapAsync(async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}))


app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")
})

app.get('/listings/:id',wrapAsync(async(req,res)=>{
   let{id} = req.params;
   const listing =await Listing.findById(id).populate("reviews")
   res.render("listings/show.ejs",{listing})
}))


app.post('/listings',valiadateListing,wrapAsync(async(req,res,next)=>{
    const newListing =new Listing (req.body.listing)  
    await newListing.save();
    res.redirect('/listings') 
}))

app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  let{id} = req.params;
   const listing =await Listing.findById(id)
   res.render("listings/edit.ejs",{listing})
}))

app.put('/listings/:id',valiadateListing,wrapAsync(async(req,res)=>{
  let{id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`);
}))

app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  let{id} = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}))

app.post('/listings/:id/reviews',valiadateReview,wrapAsync(async(req,res)=>{
 let listing =await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
res.redirect(`/listings/${listing._id}`);
}))

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
 let {id,reviewId} = req.params
 await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
 await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`)
}))

// app.get("/testListing",async(req,res)=>{
//   let sampleListing = new Listing({
//     title:"My new Villa",
//     desrciption:"By the beach",
//     price:1200,
//     location:"Calangute,Goa",
//     country:"India"
//   })
//   await sampleListing.save()
//   console.log("Sample was saved")
//   res.send("Sucessful testing");
// })

app.all('*',(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"))
 
})


app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"} =err 
  res.status(statusCode).render("error.ejs",{message})
  // res.status(statusCode).send(message)
})


app.get('/',(req,res)=>{
  res.send("Hi iam  root");
})