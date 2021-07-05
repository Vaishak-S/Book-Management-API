const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
        ISBN : String,
        title : String,   
        pubDate : String,
        language : String,
        numPage : Number,
        author : [Number],
        publication: Number,
        category : [String],
});

//Creating a book modal
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;