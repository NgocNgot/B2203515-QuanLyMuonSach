const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    msNV: {
        type: String,
        required: true,
        unique: true,
    },
    hoTenNV: {
        type: String,
        required: true,
    },
    chucVu: {
        type: String,
        required: true,
    },
    diaChi: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    soDienThoai: {
        type: String,
        required: true,
    },
});


const AdminModel = mongoose.model("Admin", AdminSchema, "nhanvien");
module.exports = AdminModel;
