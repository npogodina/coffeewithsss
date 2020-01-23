const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const Cafe = require("./models/cafe");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const port = 3000;

mongoose.connect("mongodb://localhost:27017/coffee_with_sss", { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTE
app.get("/cafes", function(req, res){
    Cafe.find({}, function(err, allCafes){
        if(err){
            console.log(err);
        } else {
            res.render("cafes/index",{cafes:allCafes});
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
   res.render("cafes/new"); 
});

// SHOW ROUTE
app.get("/cafes/:id", function(req, res){
    Cafe.findById(req.params.id).populate("comments").exec(function(err, foundCafe){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCafe);
            res.render("cafes/show", {cafe: foundCafe});
        };
    });
});

// =================
// COMMENTS ROUTES
// =================

// NEW ROUTE
app.get("/cafes/:id/comments/new", function(req, res){
   Cafe.findById(req.params.id, function(err, cafe){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {cafe: cafe});
       };
   });
});

// CREATE ROUTE
app.post("/cafes/:id/comments", function(req, res){
    //lookup cafe using ID    
    Cafe.findById(req.params.id, function(err, cafe){
        if(err){
            console.log(err);
            res.redirect("/cafes");
        } else {
            // create comment 
            var newComment = req.body.comment;
            Comment.create(newComment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add comment to cafe
                    cafe.comments.push(comment);
                    cafe.save();
                    // redirect to cafe page
                    res.redirect("/cafes/" + cafe._id);
                };
            });
        }
    });
});


app.listen(port, function(){
    console.log(`App is listening on port ${port}.`);
});
