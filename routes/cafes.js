const express = require("express");
const router = express.Router();

const Cafe    = require("../models/cafe"),
      Comment = require("../models/comment");

const middleware = require("../middleware"); //index.js requires the whole directory

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
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to cafes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // add username and id to cafe
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCafe = {name: name, image: image, description: desc, author: author};
    console.log(req.user);
    Cafe.create(newCafe, function(err, cafe){
        if(err){
            console.log(err);
        } else {
            console.log(cafe);
            res.redirect("/cafes");
        }
    });   
}); 

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("cafes/new"); 
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    Cafe.findById(req.params.id).populate("comments").exec(function(err, foundCafe){
        if(err || !foundCafe) {
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {
            res.render("cafes/show", {cafe: foundCafe});
        };
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCafeOwnership, function(req, res){
    Cafe.findById(req.params.id, function(err, foundCafe){
        res.render("cafes/edit", {cafe: foundCafe});
    });
});

// UPDATE
router.put("/:id", middleware.checkCafeOwnership, function(req, res){
    Cafe.findByIdAndUpdate(req.params.id, req.body.cafe, function(err, updatedCafe){
        if(err){
            res.redirect("/cafes");
        } else {
            res.redirect("/cafes/" + updatedCafe._id);
        };
    });
});

// DELETE
router.delete("/:id", middleware.checkCafeOwnership, function(req, res){
    Cafe.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/cafes");
        } else {
            res.redirect("/cafes");
        };
    });
});

module.exports = router;