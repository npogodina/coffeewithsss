const express = require("express");
const router  = express.Router({mergeParams: true}); // passing cafe ids to comments

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
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // add comment to cafe and save
                    cafe.comments.push(comment);
                    cafe.save();
                    console.log(comment);
                    // redirect to cafe page
                    res.redirect("/cafes/" + cafe._id);
                };
            });
        };
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {cafe_id: req.params.id, comment: foundComment});
        };
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/cafes/" + req.params.id);
        };
    });
});

// COMMENT DELETE ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/cafes/" + req.params.id);
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

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // Has the user added this comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    // If not, redirect
                    res.redirect("back");
                };
            };
        });
    // If not, redirect
    } else {
        res.redirect("back");
    };
}

module.exports = router;