const AdminModel = require("../models/AdminModel");

const AdminController = {
    // Lấy tất cả các admin
    findAll: async (req, res) => {
        AdminModel.find()
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: `Không thể lấy danh sách admin: ${err}` }));
    },

    // Lấy thông tin admin theo id
    findOne: async (req, res) => {
        const targetId = req.params.id;
        AdminModel.findById(targetId)
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: `Không tìm thấy admin: ${err}` }));
    },

    // Cập nhật thông tin admin
    updateAdmin: (req, res) => {
        const targetId = req.params.id;
        const updatedData = req.body;

        AdminModel.findByIdAndUpdate(targetId, updatedData, { new: true, runValidators: true })
            .then(updatedAdmin => {
                if (!updatedAdmin) {
                    return res.status(404).json({ message: "Admin không tìm thấy!" });
                }
                res.status(200).json({ message: "Thông tin admin đã được cập nhật!", data: updatedAdmin });
            })
            .catch(err => {
                res.status(500).json({ message: "Lỗi khi cập nhật admin!", error: err.message });
            });
    },

    // Xóa admin
    deleteAdmin: async (req, res) => {
        AdminModel.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Admin đã được xóa thành công!" }))
            .catch((err) => res.status(500).json({ message: `Không thể xóa admin: ${err}` }));
    },
};

module.exports = AdminController;
