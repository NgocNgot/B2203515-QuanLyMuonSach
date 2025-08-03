const { default: mongoose } = require("mongoose");
const BookModel = require("../models/BookModel");
const NXBModel = require("../models/NXBModel");
const BookController = {
    findAll: async (req, res) => {
        console.log("Received request to fetch all books");
        try {
            const data = await BookModel.aggregate([
                {
                    $lookup: {
                        from: "nhaxuatban",
                        localField: "maNXB",
                        foreignField: "_id",
                        as: "nxbDetails",
                    },
                },
                {
                    $unwind: "$nxbDetails",
                },
                {
                    $project: {
                        maSach: 1,
                        tenSach: 1,
                        loaiSach: 1,
                        tacGia: 1,
                        "nxbDetails.tenNXB": 1,
                        namXuatBan: 1,
                        donGia: 1,
                        soQuyen: 1,
                        chiTiet: 1,
                    },
                },
            ]);

            console.log(data);
            res.status(200).json(data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách sách:", err);
            res.status(500).json({ message: `Không thể lấy danh sách sách: ${err.message}` });
        }
    },

    findOne: async (req, res) => {
        const targetId = req.params.id;
        try {
            const data = await BookModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(targetId) }
                },
                {
                    $lookup: {
                        from: "nhaxuatban",
                        localField: "maNXB",
                        foreignField: "_id",
                        as: "nxbDetails",
                    },
                },
                {
                    $unwind: "$nxbDetails",
                },
                {
                    $project: {
                        maSach: 1,
                        tenSach: 1,
                        loaiSach: 1,
                        tacGia: 1,
                        "nxbDetails.tenNXB": 1,
                        namXuatBan: 1,
                        chiTiet: 1,
                    },
                },
            ]);
            if (!data || data.length === 0) {
                return res.status(404).json({ message: "Sách không tìm thấy!" });
            }
            console.log(data);
            res.status(200).json(data[0]);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách sách:", err);
            res.status(500).json({ message: `Không thể lấy sách: ${err.message}` });
        }
    },
    //Tìm kiếm sách theo tên
    // findByName: async (req, res) => {
    //     const { name } = req.query; // Lấy tên từ query parameters
    //     try {
    //         const data = await BookModel.find({
    //             tenSach: { $regex: name, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    //         }).populate("maNXB", "tenNXB"); // Nếu cần thông tin từ nhà xuất bản
    //         if (data.length === 0) {
    //             return res.status(404).json({ message: "Không tìm thấy sách nào." });
    //         }
    //         res.status(200).json(data);
    //     } catch (err) {
    //         console.error("Lỗi khi tìm kiếm sách:", err);
    //         res.status(500).json({ message: `Không thể tìm kiếm sách: ${err.message}` });
    //     }
    // },

    // Thay đổi hàm findByName
    // src/controllers/BookController.js
    findByName: async (req, res) => {
        const { name } = req.query; // Lấy tên từ query parameters
        if (!name) {
            return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm." });
        }
        try {
            const data = await BookModel.aggregate([
                {
                    $lookup: {
                        from: "nhaxuatban",
                        localField: "maNXB",
                        foreignField: "_id",
                        as: "nxbDetails",
                    },
                },
                {
                    $unwind: "$nxbDetails",
                },
                {
                    $match: {
                        $or: [
                            { tenSach: { $regex: name, $options: "i" } },
                            { tacGia: { $regex: name, $options: "i" } },
                            { "nxbDetails.tenNXB": { $regex: name, $options: "i" } },
                        ],
                    },
                },
                {
                    $project: {
                        maSach: 1,
                        tenSach: 1,
                        loaiSach: 1,
                        tacGia: 1,
                        "nxbDetails.tenNXB": 1,
                        namXuatBan: 1,
                        donGia: 1,
                        soQuyen: 1,
                        chiTiet: 1,
                    },
                },
            ]);

            if (data.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy sách nào phù hợp." });
            }
            res.status(200).json(data);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm sách:", err);
            res.status(500).json({ message: `Lỗi máy chủ khi tìm kiếm sách: ${err.message}` });
        }
    },



    delete: async (req, res) => {
        const targetId = req.params.id;
        try {
            const result = await BookModel.deleteOne({ _id: targetId });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Sách không tìm thấy để xóa!" });
            }
            res.status(200).json({ message: "Xóa sách thành công!" });
        } catch (err) {
            console.error("Lỗi khi xóa sách:", err);
            res.status(500).json({ message: `Không thể xóa sách: ${err.message}` });
        }
    },

    createBook: async (req, res) => {
        console.log("=== CREATE BOOK REQUEST ===");
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        const { tenSach, loaiSach, tacGia, namXuatBan, donGia, soQuyen, tenNXB, chiTiet = {} } = req.body;
        let prefix = 'VH';
        try {
            switch (loaiSach) {
                case 'Văn học':
                    prefix = 'VH';
                    break;
                case 'Kinh tế':
                    prefix = 'KT';
                    break;
                case 'Kỹ năng sống':
                    prefix = 'KN';
                    break;
                case 'Tiểu thuyết':
                    prefix = 'TT';
                    break;
                case 'Truyện thiếu nhi':
                    prefix = 'TN';
                    break;
                default:
                    throw new Error('Loại sách không hợp lệ');
            }

            // Tạo mã sách ngẫu nhiên
            const randomId = Math.floor(100 + Math.random() * 900);
            const maSach = `${prefix}${randomId}`;

            //Kiểm tra hoặc tạo mới nxb
            let nxb = await NXBModel.findOne({ tenNXB });
            if (!nxb) {
                console.log("Nhà xuất bản không tồn tại, tạo mới.");
                nxb = await NXBModel.create({
                    maNXB: `NXB${randomId}`,
                    tenNXB: tenNXB,
                    diaChi: "Địa chỉ chưa được cập nhật.",
                });
            }

            const newBook = await BookModel.create({
                maSach: maSach,
                tenSach: tenSach,
                loaiSach: loaiSach,
                tacGia: tacGia,
                namXuatBan: namXuatBan,
                donGia: donGia,
                soQuyen: soQuyen,
                maNXB: nxb._id,
                chiTiet: {
                    hinhAnh: chiTiet.hinhAnh || [],
                    moTa: chiTiet.moTa || "",
                }
            });
            res.status(200).json({ message: "Sách mới đã được tạo thành công!", data: newBook });
        } catch (err) {
            // Xử lý lỗi và trả về phản hồi lỗi
            console.error("Lỗi khi tạo sách:", err);
            res.status(500).json({ message: `Không thể tạo mới sách! ${err.message}` });
        }
    },

    updateBook: async (req, res) => {
        const targetId = req.params.id;
        const updatedData = req.body;

        try {
            const updatedBook = await BookModel.findByIdAndUpdate(targetId, updatedData, { new: true, runValidators: true });

            if (!updatedBook) {
                return res.status(404).json({ message: "Sách không tìm thấy!" });
            }

            res.status(200).json({ message: "Sách đã được cập nhật thành công!", data: updatedBook });
        } catch (err) {
            console.error('Lỗi khi cập nhật sách:', err);
            res.status(500).json({ message: "Lỗi khi cập nhật sách!!!", error: err.message });
        }
    },

    checkDuplicate: async (req, res) => {
        const { tenSach, tacGia, currentBookId } = req.body;
        
        try {
            // Tạo query để tìm sách trùng lặp
            let query = {
                tenSach: { $regex: new RegExp(`^${tenSach}$`, 'i') }, // Không phân biệt hoa thường
                tacGia: { $regex: new RegExp(`^${tacGia}$`, 'i') }
            };

            // Nếu đang edit sách, loại trừ sách hiện tại
            if (currentBookId) {
                query._id = { $ne: currentBookId };
            }

            const existingBook = await BookModel.findOne(query);
            
            res.status(200).json({ 
                isDuplicate: !!existingBook,
                message: existingBook ? 'Sách này đã tồn tại trong hệ thống!' : ''
            });
        } catch (err) {
            console.error('Lỗi khi kiểm tra sách trùng lặp:', err);
            res.status(500).json({ message: "Lỗi khi kiểm tra sách trùng lặp!", error: err.message });
        }
    },
}

module.exports = BookController;