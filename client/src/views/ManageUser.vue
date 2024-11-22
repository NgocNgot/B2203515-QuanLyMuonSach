<template>
  <div class="manage-users">
    <div class="content">
      <h1>Quản lý độc giả</h1>
      <div class="section-line"></div>
      <button class="add-user" @click="showAddUserModal">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Thêm độc giả mới
      </button>
      <table>
        <thead>
          <tr>
            <th>Mã độc giả</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.maDocGia }}</td>
            <td>{{ user.hoLot }} {{ user.ten }}</td>
            <td>{{ user.email }}</td>
            <td>{{ new Date(user.ngaySinh).toLocaleDateString() }}</td>
            <td>{{ user.phai }}</td>
            <td>{{ user.diaChi }}</td>
            <td>{{ user.dienThoai }}</td>
            <td>
              <button @click="showEditUserModal(user)">
                <font-awesome-icon :icon="['fas', 'pen']" style="color: #225771;" />
              </button>
              <button @click="deleteUser(user._id)">
                <font-awesome-icon :icon="['fas', 'eraser']" style="color: #FBA3CD;" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa độc giả -->
    <div v-if="isModalOpen" class="modal form">
      <div class="modal-content container">
        <p class="title">{{ modalType === 'add' ? 'Thêm độc giả' : 'Sửa độc giả' }}</p>
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-sm">
              <label for="hoLot">Họ lót:</label>
              <input v-model="currentUser.hoLot" type="text" id="hoLot" required />
            </div>
            <div class="col-sm">
              <label for="ten">Tên:</label>
              <input v-model="currentUser.ten" type="text" id="ten" required />
            </div>
          </div>

          <div class="row">
            <div class="col-sm">
              <label for="ngaySinh">Ngày sinh:</label>
              <input v-model="currentUser.ngaySinh" type="date" id="ngaySinh" required />
            </div>
            <div class="col-sm">
              <label for="phai">Giới tính:</label>
              <select v-model="currentUser.phai" id="phai" required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-sm">
              <label for="diaChi">Địa chỉ:</label>
              <input v-model="currentUser.diaChi" type="text" id="diaChi" required />
            </div>
            <div class="col-sm">
              <label for="dienThoai">Số điện thoại:</label>
              <input v-model="currentUser.dienThoai" type="text" id="dienThoai" required />
            </div>
          </div>

          <div class="row">
            <div class="col-sm">
              <label for="email">Email:</label>
              <input v-model="currentUser.email" type="email" id="email" required />
            </div>
            <div class="col-sm">
              <label for="password">Mật khẩu:</label>
              <input v-model="currentUser.password" type="password" id="password" required />
            </div>
          </div>

          <div class="row">
            <div class="col-sm">
              <button type="submit">Lưu</button>
              <button type="button" @click="closeModal">Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      users: [],
      isModalOpen: false,
      modalType: "add", // 'add' hoặc 'edit'
      currentUser: {
        maDocGia: "",
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "nam",
        diaChi: "",
        dienThoai: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await UserService.findAll();
        this.users = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách độc giả:", error);
      }
    },
    showAddUserModal() {
      this.modalType = "add";
      this.resetCurrentUser();
      this.isModalOpen = true;
    },
    showEditUserModal(user) {
      this.modalType = "edit";
      this.currentUser = { ...user };
      this.isModalOpen = true;
    },
    async handleSubmit() {
      try {
        if (this.modalType === "add") {
          await UserService.createUser(this.currentUser);
          alert("Thêm độc giả thành công!");
        } else {
          await UserService.updateUser(this.currentUser._id, this.currentUser);
          alert("Sửa độc giả thành công!");
        }
        this.closeModal();
        this.fetchUsers();
      } catch (error) {
        console.error("Lỗi khi lưu độc giả:", error);
        alert("Có lỗi khi lưu độc giả!");
      }
    },
    async deleteUser(id) {
      if (confirm("Bạn có chắc chắn muốn xóa độc giả này?")) {
        try {
          await UserService.delete(id);
          alert("Xóa độc giả thành công!");
          this.fetchUsers();
        } catch (error) {
          console.error("Lỗi khi xóa độc giả:", error);
        }
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetCurrentUser();
    },
    resetCurrentUser() {
      this.currentUser = {
        maDocGia: "",
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "nam",
        diaChi: "",
        dienThoai: "",
        email: "",
        password: "",
      };
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>


<style scoped>
.manage-users {
  display: flex;
  font-size: 14px;
}
.content h1 {
  color: #225771;
  font-weight: bold;
}
.add-user {
  margin-top: 12px;
  font-size: 16px;
  color: #ffff;
  border-radius: 5px;
  background-color: #225771;
  padding: 4px 16px;
}
.add-user:hover {
  color: #225771;
  background-color: #FFDCE2;
}
.section-line { 
  flex-grow: 1; 
  height: 2px; 
  background-color: #225771; 
  
}
.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
}
.content {
  flex: 1;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table th,
table td {
  border: 1px solid #225771;
  padding: 8px;
  text-align: left;
}
table th {
  background-color: #CAEBFA;
  white-space: nowrap;
  font-weight: bold;

}
table th:nth-child(2),
table td:nth-child(2) {
  width: 25%; 
}

table td:last-child button {
  margin-right: 8px;
}
table td:last-child button:last-of-type {
  margin-right: 0;
}

/*Form chức năng thêm/sửa sách */
.modal {
  position: fixed;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  background-color: white;
  padding: 8px 40px;
  border-radius: 10px;
  width: 60%;
}
.title {
  color: #225771;
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
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

.modal-content label {
  display: block;
  margin-bottom: 2px;
  color: #000;
}

.modal-content input, select {
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: #F1F1F1;
  border-radius: 5px;
  border: none;
}

.col-sm button {
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
.col-sm button:hover {
  background: #FFDCE2;
  color: #225771;
}


</style>