const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    maSach: {
        type: String,
    },
    tenSach: {
        type: String,
        required: true,
    },
    donGia: {
        type: String,
        required: true,
    },
    soQuyen: {
        type: String,
        required: true,
    },
    namXuatBan: {
        type: String,
        required: true,
    },
    maNXB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "nhaxuatban",
    },
    tacGia: {
        type: String,
        required: true,
    },
    chiTiet: {
        hinhAnh: [String], // Array of image URLs
        moTa: {
            type: String,
        }
    },
    loaiSach: {
        type: String,
        enum: ["Văn học", "Kinh tế", "Tiểu thuyết", "Kỹ năng sống", "Truyện thiếu nhi"],
        required: true,
    },

});

const BookModel = mongoose.model("Book", BookSchema, "sach");
module.exports = BookModel;