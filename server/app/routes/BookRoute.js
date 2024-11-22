const express = require('express');
const BookController = require("../controllers/BookController");
const BookRouter = express.Router();


BookRouter.post("/create", BookController.createBook);
BookRouter.delete("/delete/:id", BookController.delete);
BookRouter.get('/:id', BookController.findOne);
BookRouter.get('/search', BookController.findByName);
BookRouter.get('/', BookController.findAll);
BookRouter.put('/update/:id', BookController.updateBook);

module.exports = BookRouter;