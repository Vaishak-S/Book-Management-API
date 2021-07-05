const mongoose = require("mongoose");

//Creating a Publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Creating a Publication modal
const PublicationModel = mongoose.model("publication",PublicationSchema);

module.exports = PublicationModel;