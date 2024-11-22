const mongoose = require('mongoose')

const theoDoiMuonSachSchema = new mongoose.Schema({
    maTheoDoiMuonSach: { 
        type: String, 
        required: true, 
        unique: true,
    },
    maDocGia: { 
        type: String, 
        required: true, 
    },
    maSach: { 
        type: String, 
        required: true, 
    },
    ngayMuon: { 
        type: Date, 
        required: true,
        default: Date.now,
    },
    ngayTra: { 
        type: Date, 
        required: true, 
    },
    trangThai: { 
        type: String, 
        enum: ['Chờ xác nhận', 'Đang mượn', 'Đã trả', 'Quá hạn'], 
        default: 'Chờ xác nhận', 
    },
});

const BorrowModel = mongoose.model("theoDoiMuonSach", theoDoiMuonSachSchema, "theodoimuonsach");
module.exports = BorrowModel;