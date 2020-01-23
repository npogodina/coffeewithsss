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

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love Cody and Evelynn!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Calling a function on every route (defined below)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTE
app.get("/cafes", function(req, res){
    Cafe.find({}, function(err, allCafes){
        if(err){
            console.log(err);
        } else {
            res.render("cafes/index",{cafes:allCafes, currentUser: req.user});
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
app.get("/cafes/:id/comments/new", isLoggedIn, function(req, res){
   Cafe.findById(req.params.id, function(err, cafe){
       if(err){
           console.log(err);
       } else {
            res.render("comments/new", {cafe: cafe});
       };
   });
});

// CREATE ROUTE
app.post("/cafes/:id/comments", isLoggedIn, function(req, res){
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

// AUTH ROUTES
// Show register form
app.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

// Sign the user in
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/cafes",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/cafes");
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect("/login");
};

app.listen(port, function(){
    console.log(`App is listening on port ${port}.`);
});
