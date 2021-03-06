const express = require("express");
const router  = express.Router({mergeParams: true}); // passing cafe ids to comments

const Cafe    = require("../models/cafe"),
      Comment = require("../models/comment");

const middleware = require("../middleware"); //index.js requires the whole directory

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    Cafe.findById(req.params.id, function(err, cafe){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {cafe: cafe});
        };
    });
});
 
// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    req.flash("error", "Something went wrong.");
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
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/cafes/" + cafe._id);
                };
            });
        };
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Cafe.findById(req.params.id, function(err, foundCafe){
        if(err || !foundCafe){
            req.flash("error", "No cafe found.");
            return res.redirect("back");
        };
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {cafe_id: req.params.id, comment: foundComment});
            };
        });
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/cafes/" + req.params.id);
        };
    });
});

// COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/cafes/" + req.params.id);
        };
    });
});

module.exports = router;