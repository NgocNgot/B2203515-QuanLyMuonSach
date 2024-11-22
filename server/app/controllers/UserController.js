const AdminModel = require("../models/AdminModel");
const UserModel = require("../models/UserModel");
// Hàm tạo mã độc giả ngẫu nhiên 
function generateRandomId() { 
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `DG${randomNumber}`;
}
const UserController = {
    createUser: async(req, res) => {
        const {hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password} = req.body;
        const maDocGia = generateRandomId();
        console.log(req.body)
        UserModel.create({
            hoLot: hoLot, 
            ten: ten, 
            ngaySinh: ngaySinh,
            phai: phai,
            diaChi: diaChi,
            dienThoai: dienThoai,
            email: email,
            password: password,
            maDocGia: maDocGia
        })
        .then((data) => res.status(200).json(data))
        .catch((err) => {
            res.status(500).json({ massage: `Không thể tạo mới độc giả! ${err}` })
            console.log(err)
        })
    },
   
    login: (req, res) => {
        const { email, password } = req.body;
        AdminModel.findOne({ email, password })
        .then(admin => {
            if (admin) {
                return res.status(200).json({
                    redirectTo: "/admins",
                        user: admin,
                });
            }
            UserModel.findOne({ email, password })
            .then(user => {
                if (user) {
                    return res.status(200).json({
                        redirectTo: "/",
                        user: user,
                    });
                }

                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
            })
            .catch(err => {
                res.status(500).json({ message: `Lỗi đăng nhập! ${err}` });
            });
        })
        .catch(err => {
            res.status(500).json({ message: `Lỗi đăng nhập! ${err}` });
        });
        
    },


    checkAccount: async (req, res) => {
        const { email } = req.body;
        UserModel.findOne({ email })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: `Lỗi kiểm tra tài khoản! ${err}` }));
    },


    findAll: async (req, res) => {
        UserModel.find()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err.message))
    },

    findOne: async (req, res) => {
        const targetId = req.params.id
        UserModel.findById(targetId)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: `Tài khoản không tìm thấy! ${err}` }))
    },

    updateUser: (req, res) => {
        const targetId = req.params.id;
        const updatedData = req.body;

        UserModel.findByIdAndUpdate(targetId, updatedData, { new: true, runValidators: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: "Email không tìm thấy!" });
            }
            res.status(200).json({ message: "Thông tin độc giả đã được cập nhật thành công!", data: updatedUser });
        })
        .catch(err => {
            res.status(500).json({ message: "Lỗi khi cập nhật độc giả!!!", error: err.message });
        });
    },

    delete: async (req, res) => {
        UserModel.deleteOne({
            _id: req.params.id
        })
        .then(() => res.status(200).json({ message: "Xóa độc giả thành công!" }))
        .catch((err) => res.status(500).json({ message: `Không tìm thấy độc giả! ${err}` }))
    },
    
}
module.exports = UserController