const express = require("express");
const router = express.Router();

const passport = require("passport"),
      User     = require("../models/user");

// Landing page route
router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========
// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/cafes");
            });
        };
    });
})

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Sign the user in
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/cafes",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out.");
    res.redirect("/cafes");
});

module.exports = router;