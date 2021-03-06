const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      flash          = require("connect-flash"),
      passport       = require("passport"),
      localStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      Cafe           = require("./models/cafe"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      seedDB         = require("./seeds"),
      port           = 3000;

const commentRoutes = require("./routes/comments"),
      cafeRoutes    = require("./routes/cafes"),
      indexRoutes   = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/coffee_with_sss", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://Nataliya:Flowersmongodb09!@coffeewithsss-ijbkn.azure.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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

// Calling a function on every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/cafes", cafeRoutes);
app.use("/cafes/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log(`App is listening on port ${port}.`);
});
