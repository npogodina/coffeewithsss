var mongoose = require("mongoose");
var Cafe = require("./models/cafe");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "The French Bakery", 
        image: "https://s3-media0.fl.yelpcdn.com/bphoto/IW71uGVvEGo0qyJUkLhAqQ/o.jpg",
        description: "When you enter the door, your nose is filled up with the aroma of coffee and freshly baked pastries - a combination where one who like these finer things in life would not turn away."
    },
    {
        name: "Looking Glass Coffee", 
        image: "https://www.lookingglasscoffee.com/uploads/1/0/7/1/107188343/img-2344-edit_orig.jpg",
        description: "Choose from a selection of pastries, confections, and mini-donuts made hot and fresh right in front of you - or grab a healthy and satisfying snack from the cooler. Now serving local craft beer, wine and hard cider."
    },
    {
        name: "Honor Coffee & Tea", 
        image: "https://www.honorcoffee.com/images/site_photos/0452_1280x1280.jpg",
        description: "Honor Coffee sources, prepares, and serves the finest coffee at four inviting locations across the Puget Sound area."
    }
]
 
function seedDB(){
   //Remove all cafes
   Cafe.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed cafes!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few cafes
            data.forEach(function(seed){
                Cafe.create(seed, function(err, cafe){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a cafe");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    cafe.comments.push(comment);
                                    cafe.save();
                                    console.log("Created new comment");
                                };
                            });
                    };
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;