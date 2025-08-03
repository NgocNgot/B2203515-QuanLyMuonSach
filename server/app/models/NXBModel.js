const mongoose = require("mongoose")

const NXBSchema = new mongoose.Schema({
    maNXB: {
        type: String,
        require: true,
        unique: true,
    },
    tenNXB: {
        type: String,
        require: true,
    },
    diaChi: {
        type: String,
        require: true,
    },
});

const NXBModel = mongoose.model("NXB", NXBSchema, "nhaxuatban");
module.exports = NXBModel;