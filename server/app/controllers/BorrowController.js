// controllers/BorrowController.js
const BorrowModel = require('../models/BorrowModel');
const BookModel = require('../models/BookModel');
const BorrowController = {
  // Tạo phiếu mượn
  createBorrow: async (req, res) => {
    try {
      const borrowData = req.body;
      // Kiểm tra xem borrowData có phải là mảng không
      if (!Array.isArray(borrowData) || borrowData.length === 0) {
        return res.status(400).json({ message: "borrowData phải là một mảng" });
      }

      // Kiểm tra các trường cần thiết trong mỗi mục của borrowData
      for (let data of borrowData) {
        if (!data.maDocGia || !data.maSach || !data.ngayTra || !data.ngayMuon || !data.trangThai) {
          return res.status(400).json({
            message: "Thiếu thông tin bắt buộc trong dữ liệu mượn sách"
          });
        }
        const ngayMuon = new Date(data.ngayMuon);
        const ngayTra = new Date(data.ngayTra);

        if (isNaN(ngayMuon)) {
          return res.status(400).json({ message: "Ngày mượn không hợp lệ" });
        }
        if (isNaN(ngayTra)) {
          return res.status(400).json({ message: "Ngày trả không hợp lệ" });
        }
        if (ngayMuon >= ngayTra) {
          return res.status(400).json({ message: "Ngày trả phải lớn hơn ngày mượn" });
        }
      }

      const borrowPromises = borrowData.map(data =>{
        // Tạo mã theo dõi mượn sách
        const maTheoDoiMuonSach = `TDS${Math.floor(1000 + Math.random() * 9000)}`;
        return BorrowModel.create({
          maTheoDoiMuonSach,
          maDocGia: data.maDocGia,
          maSach: data.maSach,
          ngayTra: data.ngayTra,
          ngayMuon: data.ngayMuon,
          trangThai: data.trangThai,
        });
      });

      const newBorrows = await Promise.all(borrowPromises);
      res.status(200).json({ message: "Phiếu mượn được tạo thành công", data: newBorrows });
    } catch (err) {
      console.error("Lỗi khi tạo phiếu mượn:", err);
      res.status(500).json({ message: `Không thể tạo phiếu mượn: ${err.message}` });
    }
  },

  // Lấy tất cả phiếu mượn
  getAllBorrows: async (req, res) => {
    try {
      const borrows = await BorrowModel.find();
      res.status(200).json(borrows);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phiếu mượn:", err);
      res.status(500).json({ message: `Không thể lấy phiếu mượn: ${err.message}` });
    }
  },

  getBorrowsByUser: async (req, res) => {
    try {
      const maDocGia = req.params.maDocGia;
      const borrows = await BorrowModel.find({ maDocGia });
      res.status(200).json(borrows);
    } catch (err) {
      console.error("Lỗi khi lấy phiếu mượn:", err);
      res.status(500).json({ message: `Không thể lấy phiếu mượn: ${err.message}` });
    }
  },
  // Cập nhật phiếu mượn 
  updateBorrow: async (req, res) => { 
    try { 
      const { id } = req.params; 
      const updateData = req.body; 
      const updatedBorrow = await BorrowModel.findByIdAndUpdate(id, updateData, { new: true }); 
      res.status(200).json({ message: "Cập nhật phiếu mượn thành công", data: updatedBorrow }); 
    } catch (err) { 
      console.error("Lỗi khi cập nhật phiếu mượn:", err); 
      res.status(500).json({ message: `Không thể cập nhật phiếu mượn: ${err.message}` }); 
    } 
  }, 
  // Xóa phiếu mượn 
  deleteBorrow: async (req, res) => { 
    try { 
      const { id } = req.params; await BorrowModel.findByIdAndDelete(id); 
      res.status(200).json({ message: "Xóa phiếu mượn thành công" }); 
    } catch (err) { 
      console.error("Lỗi khi xóa phiếu mượn:", err); 
      res.status(500).json({ message: `Không thể xóa phiếu mượn: ${err.message}` }); 
    } 
  }, 
};

module.exports = BorrowController;
