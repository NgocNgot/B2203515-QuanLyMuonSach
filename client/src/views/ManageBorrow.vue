<template>
  <div class="manage-borrows">
    <div class="content">
      <h1>Quản lý phiếu mượn</h1>
      <div class="section-line"></div>
      <button class="add-borrow" @click="showAddBorrowModal">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Thêm phiếu mượn mới
      </button>
      <table>
        <thead>
          <tr>
            <th>Mã Phiếu</th>
            <th>Mã Sách</th>
            <th>Mã Độc Giả</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in borrows" :key="borrow._id">
            <td>{{ borrow.maTheoDoiMuonSach }}</td>
            <td>{{ borrow.maSach }}</td>
            <td>{{ borrow.maDocGia }}</td>
            <td>{{ formatDate(borrow.ngayMuon) }}</td>
            <td>{{ formatDate(borrow.ngayTra) }}</td>
            <td>{{ borrow.trangThai }}</td>
            <td>
              <button @click="showEditBorrowModal(borrow)">
                <font-awesome-icon :icon="['fas', 'pen']" style="color: #225771;" />
              </button>
              <button @click="deleteBorrow(borrow._id)">
                <font-awesome-icon :icon="['fas', 'eraser']" style="color: #FBA3CD;" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa phiếu mượn -->
    <div v-if="isModalOpen" class="modal form">
      <div class="modal-content container">
        <p class="title">{{ modalType === 'add' ? 'Thêm phiếu mượn' : 'Sửa phiếu mượn' }}</p>
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-sm">
              <label for="maDocGia">Mã Độc Giả:</label>
              <input v-model="currentBorrow.maDocGia" type="text" id="maDocGia" required />
            </div>
            <div class="col-sm">
              <label for="maSach">Mã Sách:</label>
              <input v-model="currentBorrow.maSach" type="text" id="maSach" required />
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <label for="ngayMuon">Ngày Mượn:</label>
              <input v-model="currentBorrow.ngayMuon" type="date" id="ngayMuon" required />
            </div>
            <div class="col-sm">
              <label for="ngayTra">Ngày Trả:</label>
              <input v-model="currentBorrow.ngayTra" type="date" id="ngayTra" required />
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <label for="trangThai">Trạng Thái:</label>
              <select v-model="currentBorrow.trangThai" id="trangThai" required>
                <option value="">Chọn trạng thái</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Quá hạn">Quá hạn</option>
              </select>
            </div>
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
import BorrowService from "@/services/BorrowService";

export default {
  data() {
    return {
      borrows: [],
      isModalOpen: false,
      modalType: "add", // 'add' hoặc 'edit'
      currentBorrow: {
        maDocGia: "",
        maSach: "",
        ngayMuon: "",
        ngayTra: "",
        trangThai: "",
      },
    };
  },
  methods: {
    async fetchBorrows() {
      try {
        const response = await BorrowService.findAll();
        console.log("Phiếu mượn nhận được từ API:", response); // Kiểm tra dữ liệu trả về từ API
        this.borrows = response; // Gán dữ liệu cho borrows
      } catch (error) {
        console.error("Lỗi khi tải danh sách phiếu mượn:", error);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${day}-${month}-${year}`;
    },
    showAddBorrowModal() {
      console.log("Nút add");
      this.modalType = "add";
      this.resetCurrentBorrow();
      this.isModalOpen = true;
    },
    showEditBorrowModal(borrow) {
      console.log("Nút edit");
  this.modalType = "edit";
  this.currentBorrow = {
    ...borrow,
    ngayMuon: borrow.ngayMuon ? borrow.ngayMuon.split("T")[0] : "",
    ngayTra: borrow.ngayTra ? borrow.ngayTra.split("T")[0] : "",
  };
  this.isModalOpen = true;
},

    async handleSubmit() {
      try {
        const borrowData = { ...this.currentBorrow };
        if (this.modalType === "add") {
          delete borrowData._id; // Xóa _id nếu đang thêm mới
          await BorrowService.create(borrowData);
          alert("Thêm phiếu mượn thành công!");
        } else {
          await BorrowService.updateBorrow(borrowData._id, borrowData);
          alert("Sửa phiếu mượn thành công!");
        }
        this.closeModal();
        this.fetchBorrows();
      } catch (error) {
        console.error("Lỗi khi lưu phiếu mượn:", error);
        alert("Có lỗi khi lưu phiếu mượn!");
      }
    },

    async deleteBorrow(id) {
      if (confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
        try {
          await BorrowService.deleteBorrow(id);
          alert("Xóa phiếu mượn thành công!");
          this.fetchBorrows();
        } catch (error) {
          console.error("Lỗi khi xóa phiếu mượn:", error);
        }
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetCurrentBorrow();
    },
    resetCurrentBorrow() {
      console.log("Hàm reset");
      this.currentBorrow = {
        maDocGia: "",
        maSach: "",
        ngayMuon: "",
        ngayTra: "",
        trangThai: "",
      };
    },
    async fetchBookByMaSach(maSach) {
      try {
        const book = await BorrowService.getBookByMaSach(maSach);
        this.currentBorrow.tenSach = book.tenSach;
      } catch (error) {
        console.error("Không tìm thấy sách:", error);
        alert("Không tìm thấy sách với mã này!");
        this.currentBorrow.tenSach = "";
      }
    },
  },
  mounted() {
    this.fetchBorrows();
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
.add-borrow {
  margin-top: 12px;
  font-size: 16px;
  color: #ffff;
  border-radius: 5px;
  background-color: #225771;
  padding: 4px 16px;
}
.add-borrow:hover {
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
/* Căn chỉnh khoảng cách giữa các nút trong cột cuối */
table td:last-child button {
  margin-right: 8px;
}
table td:last-child button:last-of-type {
  margin-right: 0;
}
/*Định dạng form chức năng thêm/sửa sách */
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