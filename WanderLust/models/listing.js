const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js')

const listingSchema = new Schema({
    title:{
     type:String,
     required:true,
    },
    description:String,
    image:{
      type:String,
      default:"https://media.istockphoto.com/id/1227329047/photo/two-ampty-chairs-facing-magnificent-sunset-view-at-beach.jpg?s=612x612&w=is&k=20&c=pekCEdFw6WhKx5hxaGA45VEAiZVwrJ6J3QExaIRcfzE=",
      set:(v) =>v==="" ?"https://media.istockphoto.com/id/1227329047/photo/two-ampty-chairs-facing-magnificent-sunset-view-at-beach.jpg?s=612x612&w=is&k=20&c=pekCEdFw6WhKx5hxaGA45VEAiZVwrJ6J3QExaIRcfzE=" :v,
    },
    price:Number,
    location:String,
    country :String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:'Review'
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    }
})

listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
})

const Listing = new mongoose.model("Listing",listingSchema)

module.exports= Listing