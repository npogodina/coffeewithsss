const Cafe = require("../models/cafe");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCafeOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Cafe.findById(req.params.id, function(err, foundCafe){
            if(err || !foundCafe){
                req.flash("error", "Cafe not found.");
                res.redirect("back");
            } else {
                // Has the user added this cafe?
                if(foundCafe.author.id.equals(req.user._id)){
                    next();
                } else {
                    // If not, redirect
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                };
            };
        });
    // If not, redirect
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    };
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                // Has the user added this comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    // If not, redirect
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                };
            };
        });
    // If not, redirect
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    };
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;