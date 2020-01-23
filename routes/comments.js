const express = require("express");
const router = express.Router({mergeParams: true}); // passing cafe ids to comments

const Cafe    = require("../models/cafe"),
      Comment = require("../models/comment");

// NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
    Cafe.findById(req.params.id, function(err, cafe){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {cafe: cafe});
        };
    });
});
 
// CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
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