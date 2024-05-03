const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing")
const path = require('path');


app.set('view engine',"ejs");
app.set("views",path.join(__dirname,"views"));


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

app.listen(8080,()=>{
console.log("server is listening to port:8080");
})

app.get('/listings',async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
})

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

app.get('/',(req,res)=>{
  res.send("Hi iam  root");
})