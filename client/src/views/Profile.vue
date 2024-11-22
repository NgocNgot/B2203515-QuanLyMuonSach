<template>
  <div class="container profile">
    <h2 class="text-center">HỒ SƠ CỦA TÔI</h2>

    <!-- Nút chuyển đổi giữa hai chế độ -->
    <div class="text-right mb-3">
      <button @click="toggleView" class="btn btn-info">
        {{ isEditing ? 'Xem phiếu mượn' : 'Thông tin của tôi' }}
      </button>
    </div>

    <!-- Chế độ xem phiếu mượn -->
    <div v-if="!isEditing">
      <div class="row borrow-info" v-if="borrows.length > 0">
        <div class="col">
          <h3>Danh sách phiếu mượn</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Mã sách</th>
                <th>Ngày mượn</th>
                <th>Ngày hẹn trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(borrow, index) in borrows" :key="index">
                <td>{{ borrow.maTheoDoiMuonSach }}</td>
                <td>{{ borrow.maSach }}</td>
                <td>{{ formatDate(borrow.ngayMuon) }}</td>
                <td>{{ formatDate(borrow.ngayTra) }}</td>
                <td>{{ borrow.trangThai }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <p>Không có phiếu mượn nào.</p>
      </div>
    </div>

    <!-- Chế độ chỉnh sửa thông tin cá nhân -->
    <div v-else>
      <form @submit.prevent="updateProfile">
        <div class="row">
          <div class="col-sm">
            <label for="hoLot">Họ lót:</label>
            <input type="text" id="hoLot" v-model="user.hoLot" required>
          </div>
          <div class="col-sm">
            <label for="ten">Tên:</label>
            <input type="text" id="ten" v-model="user.ten" required>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <label for="ngaySinh">Ngày sinh:</label>
            <input type="date" id="ngaySinh" v-model="user.ngaySinh" required>
          </div>
          <div class="col-sm">
            <label for="phai">Phái:</label>
            <select id="phai" v-model="user.phai">
              <option value="">Chọn phái của bạn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <label for="diaChi">Địa chỉ:</label>
            <input type="text" id="diaChi" v-model="user.diaChi">
          </div>
          <div class="col-sm">
            <label for="dienThoai">Số điện thoại:</label>
            <input type="text" id="dienThoai" v-model="user.dienThoai" maxlength="10" require>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" readonly>
          </div>
          <div class="col-sm">
            <label for="password">Mật khẩu:</label>
            <input type="password" id="password" v-model="user.password">
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <button type="submit" class="btn btn-primary">Cập nhật</button>
            <button type="button" class="btn btn-secondary" @click="cancelEdit">Hủy</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService";
import BorrowService from "@/services/BorrowService";

export default {
  data() {
    return {
      user: null,
      originalUser: null,
      isEditing: false,
      borrows: [],
    };
  },
  created() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const storedUser = localStorage.getItem("user");
      console.log("Stored user:", storedUser); // Log để kiểm tra dữ liệu trong localStorage

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("Parsed user data:", userData); // Log để kiểm tra dữ liệu

          if (userData && userData.data) {
            this.user = userData.data;
            this.originalUser = userData.data;
            this.fetchBorrows();
          } else {
            console.error('Không có trường "data" trong dữ liệu người dùng');
            this.$router.push('/login'); // Chuyển hướng đến trang đăng nhập nếu không có dữ liệu hợp lệ
          }
        } catch (error) {
          console.error('Lỗi khi parse dữ liệu từ localStorage:', error);
          this.$router.push('/login'); // Chuyển hướng đến trang đăng nhập nếu parse lỗi
        }
      } else {
        console.error('Không tìm thấy thông tin trong localStorage');
        this.$router.push('/login'); // Chuyển hướng đến trang đăng nhập nếu không có dữ liệu
      }
    },
    async fetchBorrows() {
      try {
        if (this.user && this.user.maDocGia) {
          const borrows = await BorrowService.getByUser(this.user.maDocGia);
          this.borrows = Array.isArray(borrows) ? borrows : [];
          console.log("Fetched borrows:", this.borrows); // Kiểm tra dữ liệu phiếu mượn
        }
      } catch (err) {
        console.error('Lỗi khi lấy phiếu mượn:', err);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${day}-${month}-${year}`;
    },
    toggleView() {
      this.isEditing = !this.isEditing;
    },
    async updateProfile() {
      try {
        // Gửi yêu cầu cập nhật thông tin người dùng đến backend
        const response = await UserService.updateUser(this.user._id, this.user);

        if (response) {
          // Nếu cập nhật thành công, cập nhật lại thông tin trong localStorage
          localStorage.setItem("user", JSON.stringify({ data: this.user }));
          alert("Thông tin của bạn đã được cập nhật!");
        } else {
          alert("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        alert("Đã có lỗi xảy ra khi cập nhật thông tin!");
      }
    },
    cancelEdit() {
      // Phục hồi thông tin cũ từ localStorage
      this.user = { ...this.originalUser };
      this.toggleView();
    },
  },
};
</script>


<!-- <script>
import UserService from "@/services/UserService"; // Import UserService
import BorrowService from "@/services/BorrowService"; // Import BorrowService

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")).data || null, // Lấy thông tin người dùng từ localStorage
      originalUser: JSON.parse(localStorage.getItem("user")).data || null, // Lưu trữ thông tin gốc để có thể hủy bỏ
      isEditing: false, // Trạng thái xem/chỉnh sửa thông tin
      borrows: [], // Danh sách phiếu mượn
    };
  },
  created() {
    this.fetchBorrows();
  },
  methods: {
    async fetchBorrows() {
      try {
        if (this.user.maDocGia) {
          this.borrows = await BorrowService.getByUser(this.user.maDocGia);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phiếu mượn:', err);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${day}-${month}-${year}`;
    },
    toggleView() {
      this.isEditing = !this.isEditing;
    },
    async updateProfile() {
      try {
        // Gửi yêu cầu cập nhật thông tin người dùng đến backend
        const response = await UserService.updateUser(this.user._id, this.user);
        
        if (response) {
          // Nếu cập nhật thành công, cập nhật lại thông tin trong localStorage
          localStorage.setItem("user", JSON.stringify({ data: this.user }));
          
          // Thông báo thành công
          alert("Thông tin của bạn đã được cập nhật!");
        } else {
          // Thông báo nếu có lỗi
          alert("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        alert("Đã có lỗi xảy ra khi cập nhật thông tin!");
      }
    },
    cancelEdit() {
      // Phục hồi thông tin cũ từ localStorage
      this.user = { ...this.originalUser };
      this.toggleView();
    },
  },
};
</script> -->

<style scoped>
.profile {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile h2 {
  color: #225771;
  font-size: 36px;
  font-weight: bold;
}
.btn-info {
  margin-top: 0px;
}
.row {
  display: flex;
  margin-bottom: 8px;
}

.col-sm {
  flex: 1;
  margin-right: 8px;
}

.col-sm:last-child {
  margin-right: 0;
}
table {
  width: 100%;
  border-collapse: collapse;

}
table th, table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
table th {
  background-color: #225771;
  color: white;
}
.profile label {
  display: block;
  margin-bottom: 2px;
  color: #000;
}

.profile input, select {
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: #F1F1F1;
  border-radius: 5px;
  border: none;
}

button {
  width: 20%;
  height: 40px;
  padding: 8px;
  background: #225771;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 26px;
  margin-right: 8px;
  cursor: pointer;
}

button:hover {
  background: #FFDCE2;
  color: #225771;
}

.borrow-info h3 {
  color: #225771;
  margin-bottom: 10px;
}

table th, table td {
  text-align: center;
}
</style>
