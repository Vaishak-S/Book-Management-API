let books = [
    {
        ISBN : "12345One",
        title : "Getting started with MERN",
        pubDate : "2021-07-07",
        language : "en",
        numPage : 250,
        author : [1,2],
        publication: 123,
        category : ["tech","programming","education","thriller"],
    },
    {
        ISBN : "12345Two",
        title : "Getting started with Python",
        pubDate : "2021-07-07",
        language : "en",
        numPage : 250,
        author : [1,2],
        publication: 789,
        category : ["tech","fiction","webdev"],
    },

];

const author = [
    {
        id: 1,
        name: "Vaishak",
        books: ["12345Book","123456789Secret"],
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"],
    },
];

const publication = [
    {
        id: 123,
        name: "writex",
        books: ["12345Book"]
    },
    {
        id: 789,
        name: "vickie",
        books: []
    },
];

module.exports = {books, author, publication};