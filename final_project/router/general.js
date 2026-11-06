const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }
  if (!isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }
  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

/* ------------------------------------------------------------------
 * Promise helpers - simulate an asynchronous data source for the books
 * ------------------------------------------------------------------ */
const getAllBooks = () => new Promise((resolve) => resolve(books));

const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
  if (books[isbn]) resolve(books[isbn]);
  else reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
});

const getBooksByAuthor = (author) => new Promise((resolve, reject) => {
  const result = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) result[isbn] = books[isbn];
  });
  if (Object.keys(result).length > 0) resolve(result);
  else reject({ status: 404, message: `No books found for author ${author}` });
});

const getBooksByTitle = (title) => new Promise((resolve, reject) => {
  const result = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) result[isbn] = books[isbn];
  });
  if (Object.keys(result).length > 0) resolve(result);
  else reject({ status: 404, message: `No books found with title ${title}` });
});

// Task 1 / Task 10: Get the book list available in the shop (async/await + Promise)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 / Task 11: Get book details based on ISBN (Promise callbacks)
public_users.get('/isbn/:isbn', function (req, res) {
  getBookByISBN(req.params.isbn)
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 3 / Task 12: Get book details based on author (async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const result = await getBooksByAuthor(req.params.author);
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 4 / Task 13: Get all books based on title (async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const result = await getBooksByTitle(req.params.title);
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

/* ------------------------------------------------------------------
 * Tasks 10-13: client functions using Axios (async/await and Promises)
 * They call the endpoints above over HTTP.
 * ------------------------------------------------------------------ */

// Task 10: Get all books - async/await with Axios
const fetchAllBooks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error.message);
    throw error;
  }
};

// Task 11: Search by ISBN - Promise callbacks with Axios
const fetchBookByISBN = (isbn) => {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      throw error;
    });
};

// Task 12: Search by Author - async/await with Axios
const fetchBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    throw error;
  }
};

// Task 13: Search by Title - async/await with Axios
const fetchBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books with title ${title}:`, error.message);
    throw error;
  }
};

module.exports.general = public_users;
module.exports.fetchAllBooks = fetchAllBooks;
module.exports.fetchBookByISBN = fetchBookByISBN;
module.exports.fetchBooksByAuthor = fetchBooksByAuthor;
module.exports.fetchBooksByTitle = fetchBooksByTitle;
