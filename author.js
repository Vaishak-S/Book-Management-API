const mongoose = require("mongoose");

//Creating a Author schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Creating a Author modal
const AuthorModel = mongoose.model("author",AuthorSchema);

module.exports = AuthorModel;