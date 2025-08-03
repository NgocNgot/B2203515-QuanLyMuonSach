const express = require('express');
const BookController = require("../controllers/BookController");
const BookRouter = express.Router();

BookRouter.get('/search', BookController.findByName);
BookRouter.get('/:id', BookController.findOne);
BookRouter.get('/', BookController.findAll);
BookRouter.post("/create", BookController.createBook);
BookRouter.put('/update/:id', BookController.updateBook);
BookRouter.delete("/delete/:id", BookController.delete);
BookRouter.post("/check-duplicate", BookController.checkDuplicate);

module.exports = BookRouter;