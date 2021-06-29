const express = require("express");

//importing database
const database = require("./database/node_modules");

//Initialization
const booky = express();

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
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
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
booky.get("/author/specific/:authorId", (req,res) => {
    const getSpecificAuthor = database.author.filter((num) => 
    num.id === req.params.authorId
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({
            error: `No author found for the ID of ${req.params.authorId}`,
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
Parameter       none
Methods         get
*/ 
booky.get("/publications/:num", (req,res) => {
    const getSpecificPublication = database.publication.filter
    ((publications) => publications.id === req.params.num
    );

    if(getSpecificPublication.length === 0) {
        return res.json({
            error: `No publication found for the Id of ${req.params.num}`,
    });
}

return res.json({publication: getSpecificPublication });
});



booky.listen(4000, () => console.log("The server is running"));