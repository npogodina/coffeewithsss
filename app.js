const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

mongoose.connect("mongodb://localhost:27017/coffee_with_sss", { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var cafeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Cafe = mongoose.model("Cafe", cafeSchema);

// Cafe.create(
//     {
//         name: "The French Bakery",
//         image: "https://s3-media0.fl.yelpcdn.com/bphoto/IW71uGVvEGo0qyJUkLhAqQ/o.jpg",
//         description: "When you enter the door,  your nose is filled up with the aroma of coffee and freshly baked pastries - a combination where  one who like these finer things in life would not turn away."
//     }, function(err, cafe){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Created a new cafe: ");
//             console.log(cafe);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTE
app.get("/cafes", function(req, res){
    Cafe.find({}, function(err, allCafes){
        if(err){
            console.log(err);
        } else {
            res.render("index",{cafes:allCafes});
        }
    });
});

// CREATE ROUTE
app.post("/cafes", function(req, res){
    // get data from form and add to cafes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCafe = {name: name, image: image, description: desc};
    Cafe.create(newCafe, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log("all good!");
            res.redirect("/cafes");
        }
    });   
}); 

// NEW ROUTE
app.get("/cafes/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW ROUTE
app.get("/cafes/:id", function(req, res){
    Cafe.findById(req.params.id, function(err, foundCafe){
        if(err) {
            console.log(err);
        } else {
            res.render("show", {cafe: foundCafe});
        };
    });
});

app.listen(port, function(){
    console.log(`App is listening on port ${port}.`);
});
