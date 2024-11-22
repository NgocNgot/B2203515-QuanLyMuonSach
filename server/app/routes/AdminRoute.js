const express = require("express");
const AdminController = require("../controllers/AdminController");

const router = express.Router();

// Route lấy tất cả các admin
router.get("/", AdminController.findAll);

// Route lấy thông tin admin theo ID
router.get("/admin/:id", AdminController.findOne);

// Route cập nhật thông tin admin
router.put("/admin/update/:id", AdminController.updateAdmin);

// Route xóa admin
router.delete("/admin/delete/:id", AdminController.deleteAdmin);

module.exports = router;
