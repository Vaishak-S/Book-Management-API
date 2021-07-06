
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//importing database
const database = require("./index");

//Models
const BookModel = require("./book");
const AuthorModel = require("./author");
const PublicationModel = require("./publication");


//Initialization
const booky = express();

//configuration
booky.use(express.json());

//Establishing database connection
mongoose.connect(process.env.MONGO_URL, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true 
})
.then(() => console.log("Connection Established"));

/*
Route           /
Description     to get all books
Access          public
Parameter       none
Methods         get
*/  
booky.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route           /is
Description     to get specific books based on ISBN
Access          public
Parameter       isbn
Methods         get
*/  
booky.get("/is/:isbn", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
    });
}

return res.json({book: getSpecificBook });
});

/*
Route           /c
Description     to get specific books based on category
Access          public
Parameter       category
Methods         get
*/  
booky.get("/c/:category", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    
    
    if(!getSpecificBook) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({book: getSpecificBook });
});

/*
Route           /l
Description     to get specific books based on language
Access          public
Parameter       language
Methods         get
*/  
booky.get("/l/:language", async (req,res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.language});
    
    if(!getSpecificBook) {
        return res.json({
            error: `No book found for the language of ${req.params.language}`,
    });
  }
  return res.json({book: getSpecificBook });
});

/*
Route           /author
Description     to get all author
Access          public
Parameter       none
Methods         get
*/  
booky.get("/author", async (req,res) => {
    const getAllAuthor = await AuthorModel.find();
    return res.json({getAllAuthor});
});

/*
Route           /Author/ID
Description     to get specific Author
Access          public
Parameter       authorId
Methods         get
*/  
booky.get("/author/:ID", async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: req.params.ID});

    if(!getSpecificAuthor) {
        return res.json({
            error: `No author found for the ID of ${req.params.ID}`,
    });
};

return res.json({author: getSpecificAuthor });
});


/*
Route           /author/book
Description     to get all author based on books
Access          public
Parameter       isbn
Methods         get
*/ 
booky.get("/author/book/:isbn", async (req,res) =>{
    const getSpecificAuthor = await BookModel({isbn: req.params.isbn});
    
    if(!getSpecificAuthor) {
        return res.json({
            error: `No author found for the book of ${req.params.isbn}`,
    });
  }

  return res.json({author: getSpecificAuthor });
});

/*
Route           /publications
Description     to get all publications
Access          public
Parameter       none
Methods         get
*/ 
booky.get("/publications", async(req,res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json({getAllPublication});
});

/*
Route           /publications
Description     to get a specific publication
Access          public
Parameter       num
Methods         get
*/ 
booky.get("/publications/id/:num", async (req,res) => {
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.num});

    if(!getSpecificPublication) {
        return res.json({
            error: `No publication found for the Id of ${req.params.num}`,
    });
}

return res.json({publication: getSpecificPublication });
});

/*
Route           /publications/book
Description     to get all publications based on books
Access          public
Parameter       name
Methods         get
*/ 
booky.get("/publications/book/:name", async (req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({books: req.params.name});
    
    if(!getSpecificPublication) {
        return res.json({
            error: `No publication found for the book of ${req.params.name}`,
    });
  }

  return res.json({publications: getSpecificPublication });
});

/*
Route           /book/add
Description     to add new book
Access          public
Parameter       none
Methods         post
*/ 

booky.post("/book/add", async (req,res) => {
    const { newBook } = req.body.newBook;
    const addNewBook = await BookModel.create(newBook);
    return res.json({books: addNewBook, message: "New book added"});
});

/*
Route           /author/add
Description     to add new author
Access          public
Parameter       none
Methods         post
*/ 
booky.post("/author/add", async (req, res) => {
    const  newAuthor  = req.body.newAuthor;
    const addNewAuthor = await AuthorModel.create(newAuthor);    
    return res.json({author: addNewAuthor , message: "New author added"});
});

/*
Route           /publish/add
Description     to add new publication
Access          public
Parameter       none
Methods         post
*/ 
booky.post("/publish/add", async (req, res) => {
    const  newPublication  = req.body.newPublication;
    const addNewPublication = await PublicationModel.create(newPublication);
    return res.json({publication: addNewPublication , message: "New publication added"});
});

/*
Route           /book/update/title
Description     to update book title
Access          public
Parameter       isbn
Methods         put
*/ 
booky.put("/book/update/title/:isbn", async (req,res) => {
    
    const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn,
    }, 
    { 
        title: req.body.bookTitle,
    }, 
    {
        new: true,
    }
    );  
    return res.json({books: updatedBook});
});

/*
Route           /book/update/author
Description     to update/add a new author
Access          public
Parameter       isbn
Methods         put
*/ 
booky.put("/book/update/author/:isbn", async (req,res) => {
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
    {
        ISBN: req.params.isbn
    },
    {
        $push: {authors: req.body.newAuthor}
    },
    {
        new: true
    });

    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
        id: req.body.newAuthor
    },
    {
        $addToSet: {books: req.params.isbn}
    },
    {
        new: true
    },
);
return res.json(
    {
        books: updatedBook,
        author: updatedAuthor,
        message: "New author was added",
    });
});

/*
Route           /auth
Description     to update author name using Id
Access          public
Parameter       isbn
Methods         put
*/ 
booky.put("/author/update/name/:num", (req,res) => {
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.num)){
            author.name = req.body.newAuthorName;
            return;
        }
    });
    return res.json({author: database.author});
});

/*
Route           /publication/update/name
Description     to update publication name using Id
Access          public
Parameter       num
Methods         put
*/ 
booky.put("/publication/update/name/:num", (req,res) => {
    database.publication.forEach((publication) => {
        if(publication.id === parseInt(req.params.num)){
            publication.name = req.body.newPublicationName;
            return;
        }
    });
    return res.json({publication: database.publication});
});

booky.put("/publication/update/book/:isbn", (req,res) => {
    //update publication database
    database.publication.forEach((pub) => {
        if(pub.id == req.body.pubId) {
            return publication.book.push(req.params.isbn);
        }
    });

    //update book database
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books, 
        publications: database.publications,
        message: "Successfully updated publication"
    });
});

/*
Route           /book/delete
Description     to delete a book 
Access          public
Parameter       isbn
Methods         delete
*/ 
booky.delete("/book/delete/:isbn", async (req,res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({
        ISBN : req.params.isbn
    });
    return res.json({books: updatedBookDatabase});
}); 

/*
Route           /book/delete/author
Description     to delete a author from a book 
Access          public
Parameter       isbn,authorId
Methods         delete
*/ 
booky.delete("/book/delete/author/:isbn/:authorId", async(req,res) => {
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    },
    {
        $pull: { authors: parseInt(req.params.authorId)},
    },
    {
        new: true
    });

    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(req.params.authorId)
    },
    {
        $pull: { books: req.params.isbn}
    },
    {
        new: true
    });


    return res.json({
        books: updatedBook,
    author: updatedAuthor,
    message: "Author was deleted!!!"
});
});

/*
Route           /author/delete
Description     to delete an author 
Access          public
Parameter       num
Methods         delete
*/ 
booky.delete("/author/delete/:num", (req,res) => {
    const updatedAuthorDatabase = database.author.filter((auth) =>
        auth.id != req.params.num
        );
        database.author = updatedAuthorDatabase;
        return res.json({author: database.author});
}); 

/*
Route           /publication/delete
Description     to delete an publication 
Access          public
Parameter       num
Methods         delete
*/ 
booky.delete("/publication/delete/:num", (req,res) => {
    const updatedPublicationDatabase = database.publication.filter((publish) =>
    publish.id != req.params.num
        );
        database.publication = updatedPublicationDatabase;
        return res.json({publication: database.publication});
}); 

/*
Route           /publication/delete/book
Description     to delete a book from publication 
Access          public
Parameter       isbn,pubId
Methods         delete
*/ 
booky.delete("/publication/delete/book/:isbn/:pubId", (req,res) =>{
    //update publication database
    database.publication.forEach((publish) => {
    if(publish.id == parseInt(req.params.pubId)){
        const newBooksList = publication.books.filter((book) => 
            book != req.params.isbn 
            );
        publications.books = newBooksList;
        return;
        }
    });
    //update publication database
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn){
            book.publication = 0; //No publication available
            return;   
        }
    });
    return res.json({books: database.books, publication: database.publication});
    
});

booky.listen(4000, () => console.log("The server is running"));
