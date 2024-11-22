const express = require("express");
const NXBController = require("../controllers/NXBController");

const router = express.Router();

// Lấy danh sách tất cả nhà xuất bản
router.get("/", NXBController.findAll);

// Tạo mới một nhà xuất bản
router.post("/create", NXBController.createNXB);

// Sửa thông tin nhà xuất bản
router.put("/update/:id", NXBController.updateNXB);

// Xóa một nhà xuất bản
router.delete("/delete/:id", NXBController.delete);

module.exports = router;
