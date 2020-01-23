const express = require("express");
const router = express.Router();

const Cafe    = require("../models/cafe"),
      Comment = require("../models/comment");

// INDEX ROUTE
router.get("/", function(req, res){
    Cafe.find({}, function(err, allCafes){
        if(err){
            console.log(err);
        } else {
            res.render("cafes/index",{cafes:allCafes, currentUser: req.user});
        }
    });
});

// CREATE ROUTE
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
   res.render("cafes/new"); 
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    Cafe.findById(req.params.id).populate("comments").exec(function(err, foundCafe){
        if(err) {
            console.log(err);
        } else {
            res.render("cafes/show", {cafe: foundCafe});
        };
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect("/login");
};

module.exports = router;