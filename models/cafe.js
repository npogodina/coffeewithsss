const mongoose = require("mongoose");

var cafeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    lattePrice: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

module.exports = mongoose.model("Cafe", cafeSchema);