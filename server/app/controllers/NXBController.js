const NXBModel = require("../models/NXBModel");

const NXBController = {
    // Lấy danh sách tất cả nhà xuất bản
    findAll: async (req, res) => {
        try {
            const nxbs = await NXBModel.find({});
            res.status(200).json(nxbs);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách NXB:", err);
            res.status(500).json({ message: "Không thể lấy danh sách nhà xuất bản!" });
        }
    },

    // Tạo mới một nhà xuất bản
    createNXB: async (req, res) => {
        const { diaChi, tenNXB } = req.body;

        try {
            // Kiểm tra trùng tên NXB
            const existingNXB = await NXBModel.findOne({ tenNXB });
            if (existingNXB) {
                return res.status(400).json({ message: "Tên nhà xuất bản đã tồn tại!" });
            }

            // Tạo mã NXB ngẫu nhiên (3 ký tự đầu là 'NXB', 3 ký tự sau là số ngẫu nhiên)
            const randomDigits = Math.floor(100 + Math.random() * 900); // Số ngẫu nhiên 3 chữ số
            const maNXB = `NXB${randomDigits}`;

            // Tạo mới nhà xuất bản
            const newNXB = await NXBModel.create({ maNXB, diaChi, tenNXB });
            res.status(201).json({ message: "Nhà xuất bản được tạo thành công!", data: newNXB });
        } catch (err) {
            console.error("Lỗi khi tạo NXB:", err);
            res.status(500).json({ message: `Không thể tạo nhà xuất bản: ${err.message}` });
        }
    },

    // Sửa thông tin nhà xuất bản
    updateNXB: async (req, res) => {
        const { id } = req.params;
        const { maNXB, diaChi, tenNXB } = req.body;

        try {
            const updatedNXB = await NXBModel.findByIdAndUpdate(
                id,
                { maNXB, diaChi, tenNXB },
                { new: true }
            );

            if (!updatedNXB) {
                return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
            }

            res.status(200).json({ message: "Cập nhật thành công!", data: updatedNXB });
        } catch (err) {
            console.error("Lỗi khi cập nhật NXB:", err);
            res.status(500).json({ message: `Không thể cập nhật: ${err.message}` });
        }
    },

    // Xóa nhà xuất bản
    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedNXB = await NXBModel.findByIdAndDelete(id);

            if (!deletedNXB) {
                return res.status(404).json({ message: "Không tìm thấy nhà xuất bản!" });
            }

            res.status(200).json({ message: "Xóa thành công!" });
        } catch (err) {
            console.error("Lỗi khi xóa NXB:", err);
            res.status(500).json({ message: `Không thể xóa: ${err.message}` });
        }
    },
};

module.exports = NXBController;
