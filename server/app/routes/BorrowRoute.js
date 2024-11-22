// routes/BorrowRoute.js
const express = require('express');
const BorrowController = require('../controllers/BorrowController');
const BorrowRouter = express.Router();

BorrowRouter.post('/create', BorrowController.createBorrow);
BorrowRouter.get('/', BorrowController.getAllBorrows);
BorrowRouter.get('/:maDocGia', BorrowController.getBorrowsByUser);
// API cập nhật phiếu mượn sách 
BorrowRouter.put('/update/:id', BorrowController.updateBorrow); 
// API xóa phiếu mượn sách 
BorrowRouter.delete('/delete/:id', BorrowController.deleteBorrow);
module.exports = BorrowRouter;
