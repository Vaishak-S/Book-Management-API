
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

//importing database
const database = require("./index");

//Models
const BookModels = require("./book");
const AuthorModels = require("./author");
const PublicationModels = require("./publication");


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
booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
Route           /is
Description     to get specific books based on ISBN
Access          public
Parameter       isbn
Methods         get
*/  
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter((book) =>
    book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0) {
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
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
    );
    
    if(getSpecificBook.length === 0) {
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
booky.get("/l/:language", (req,res) => {
    const getSpecificBook = database.books.filter((book) =>
    book.language.includes(req.params.language)
    );
    
    if(getSpecificBook.length === 0) {
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
booky.get("/author", (req,res) => {
    return res.json({author: database.author});
});

/*
Route           /Author/ID
Description     to get specific Author
Access          public
Parameter       authorId
Methods         get
*/  
booky.get("/author/:ID", (req,res) => {
    const id=req.params.ID;
    const getSpecificAuthor = database.author.filter((num) => 
    num.id === req.params.ID
    );
console.log(getSpecificAuthor);
    if(getSpecificAuthor.length === 0) {
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
booky.get("/author/book/:isbn", (req,res) =>{
    const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
    );
    
    if(getSpecificAuthor.length === 0) {
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
booky.get("/publications", (req,res) => {
    return res.json({publications: database.publication});
});

/*
Route           /publications
Description     to get a specific publication
Access          public
Parameter       num
Methods         get
*/ 
booky.get("/publications/id/:num", (req,res) => {
    const getSpecificPublications = database.publication.filter((publications) => 
    publications.id == req.params.num
    );

    if(getSpecificPublications.length === 0) {
        return res.json({
            error: `No publication found for the Id of ${req.params.num}`,
    });
}

return res.json({publication: getSpecificPublications });
});

/*
Route           /publications/book
Description     to get all publications based on books
Access          public
Parameter       name
Methods         get
*/ 
booky.get("/publications/book/:name", (req,res) =>{
    const getSpecificPublications = database.publication.filter((publications) =>
    publications.books.includes(req.params.name)
    );
    
    if(getSpecificPublications.length === 0) {
        return res.json({
            error: `No publication found for the book of ${req.params.name}`,
    });
  }

  return res.json({publications: getSpecificPublications });
});

/*
Route           /book/add
Description     to add new book
Access          public
Parameter       none
Methods         post
*/ 

booky.post("/book/add", (req,res) => {
    const { newBook } = req.body.newBook;

    database.books.push(newBook);
    return res.json({books: database.books});
});

/*
Route           /author/add
Description     to add new author
Access          public
Parameter       none
Methods         post
*/ 
booky.post("/author/add", (req, res) => {
    const  newAuthor  = req.body.newAuthor;
    database.author.push(newAuthor);
    return res.json({author: database.author});
});

/*
Route           /publish/add
Description     to add new publication
Access          public
Parameter       none
Methods         post
*/ 
booky.post("/publish/add", (req, res) => {
    const  newPublication  = req.body.newPublication;
    database.publication.push(newPublication);
    return res.json({publication: database.publication});
});

/*
Route           /book/update/title
Description     to update book title
Access          public
Parameter       isbn
Methods         put
*/ 
booky.put("/book/update/title/:isbn", (req,res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({books: database.books});
});

/*
Route           /book/update/author
Description     to update/add a new author
Access          public
Parameter       isbn
Methods         put
*/ 
booky.put("/book/update/author/:isbn/:authorId", (req,res) => {
//update book database
database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
        return book.author.push(parseInt(req.params.authorId));
    }
});
//update author database
database.author.forEach((author) => {
    if(author.id === parseInt(req.params.authorId))
        return author.books.push(req.params.isbn);
    });
    return req.json({books: database.books, author: database.author});
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
booky.delete("/book/delete/:isbn", (req,res) => {
    const updatedBookDatabase = database.books.filter((book) =>
        book.ISBN !== req.params.isbn
        );
        database.books = updatedBookDatabase;
        return res.json({books: database.books});
}); 

/*
Route           /book/delete/author
Description     to delete a author from a book 
Access          public
Parameter       isbn,authorId
Methods         delete
*/ 
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn) {
            const newAuthorList = book.author.filter((auth) => 
            auth !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    //update the book database
    database.author.forEach((auth) => {
        if(auth.id == parseInt(req.params.authorId)){
            const newBooksList = auth.books.filter((book) => {
                book.ISBN !== req.params.isbn;
            });
            auth.books = newBooksList;
            return;
        }
    });
    return res.json({
        books: database.books,
    author: database.author,
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