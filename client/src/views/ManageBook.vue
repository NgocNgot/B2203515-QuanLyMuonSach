<template>
<div class="manage-books">
  <div class="content">
    <h1>Quản lý sách</h1>
    <div class="section-line"></div>
    <button class="add-book" @click="showAddBookModal">
      <font-awesome-icon :icon="['fas', 'plus']" />
      Thêm sách mới
    </button>
    <table>
      <thead>
        <tr>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Thể loại</th>
          <th>Tác giả</th>
          <th>Tên NXB</th>
          <th>Năm XB</th>
          <th>Đơn giá</th>
          <th>Số quyển</th>
          <!-- <th>Tình trạng</th> -->
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book._id">
          <td>{{ book.maSach }}</td>
          <td>{{ book.tenSach }}</td>
          <td>{{ book.loaiSach }}</td>
          <td>{{ book.tacGia }}</td>
          <td>{{ book.nxbDetails.tenNXB }}</td>
          <td>{{ book.namXuatBan }}</td>
          <td>{{ book.donGia }}</td>
          <td>{{ book.soQuyen }}</td>
          <td>
            <button @click="showEditBookModal(book)">
              <font-awesome-icon :icon="['fas', 'pen']" style="color: #225771;"/>
            </button>
            <button @click="deleteBook(book._id)">
              <font-awesome-icon :icon="['fas', 'eraser']" style="color: #FBA3CD;"/>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal thêm/sửa sách -->
  <div v-if="isModalOpen" class="modal form">
    <div class="modal-content container">
      <p class="title">{{ modalType === 'add' ? 'Thêm sách' : 'Sửa sách' }}</p>
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-sm">
            <label for="tenSach">Tên Sách:</label>
            <input v-model="currentBook.tenSach" type="text" id="tenSach" required />
          </div>
          <div class="col-sm">
            <label for="loaiSach">Loại Sách:</label>
            <select v-model="currentBook.loaiSach" type="text" id="loaiSach" required>
              <option value="">Chọn thể loại sách</option>
              <option value="Văn học">Văn học</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Tiểu thuyết">Tiểu thuyết</option>
              <option value="Kỹ năng sống">Kỹ năng sống</option>
              <option value="Truyện thiếu nhi">Truyện thiếu nhi</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="tacGia">Tác giả:</label>
            <input v-model="currentBook.tacGia" type="text" id="tacGia" required />
          </div>
          <div class="col-sm">
            <label for="tenNXB">Tên NXB:</label>
            <input v-model="currentBook.tenNXB" type="text" id="tenNXB" required />
          </div>
        </div>
        
        <div class="row">
          <div class="col-sm">
            <label for="namXuatBan">Năm xuất bản:</label>
            <input v-model="currentBook.namXuatBan" type="text" id="namXuatBan" required />
          </div>
          <div class="col-sm">
            <label for="donGia">Đơn giá:</label>
            <input v-model="currentBook.donGia" type="text" id="donGia" required />
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="hinhAnh">Hình ảnh:</label>
            <input v-model="currentBook.chiTiet.hinhAnh" type="text" id="hinhAnh" required />
          </div>
          <div class="col-sm">
            <label for="moTa">Mô tả:</label>
            <input v-model="currentBook.chiTiet.chiTiet" type="text" id="moTa" required />
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="soQuyen">Số quyển:</label>
            <input v-model="currentBook.soQuyen" type="number" id="soQuyen" required />
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
import BookService from "@/services/BookService";
import axios from "axios";

export default {
  data() {
    return {
      books: [],
      isModalOpen: false,
      modalType: "add", // 'add' hoặc 'edit'
      currentBook: {
        maSach: "",
        tenSach: "",
        loaiSach: "",
        tacGia: "",

        namXuatBan: "",
        donGia: "",
        soQuyen: "",
      },
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await BookService.getAll();
        this.books = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
      }
    },
    showAddBookModal() {
      this.modalType = "add";
      this.resetCurrentBook();
      this.isModalOpen = true;
    },
    showEditBookModal(book) {
      console.log(book);
      this.modalType = "edit";
      this.currentBook = { 
        ...book,
        chiTiet: {
          ...book.chiTiet
        }, 
      };
      this.isModalOpen = true;
    },
    async handleSubmit() {
      try {
        if (this.modalType === "add") {
          await BookService.create(this.currentBook);
          alert("Thêm sách thành công!");
        } else {
          await BookService.update(this.currentBook._id, this.currentBook);
          alert("Sửa sách thành công!");
        }
        this.closeModal();
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi lưu sách:", error);
        alert("Có lỗi khi lưu sách!");
      }
    },
    async deleteBook(id) {
      if (confirm("Bạn có chắc chắn muốn xóa sách này?")) {
        try {
          await BookService.delete(id);
          alert("Xóa sách thành công!");
          this.fetchBooks();
        } catch (error) {
          console.error("Lỗi khi xóa sách:", error);
        }
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetCurrentBook();
    },
    resetCurrentBook() {
      this.currentBook = {
        maSach: "",
        tenSach: "",
        loaiSach: "",
        tacGia: "",
        namXuatBan: "",
        donGia: "",
        soQuyen: "",
        tenNXB: "",
        chiTiet: {
          hinhAnh: [],
          moTa: "",
        },
      };
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.manage-books {
  display: flex;
  font-size: 14px;
}
.content h1 {
  color: #225771;
  font-weight: bold;
}
.add-book {
  margin-top: 12px;
  font-size: 16px;
  color: #ffff;
  border-radius: 5px;
  background-color: #225771;
  padding: 4px 16px;
}
.add-book:hover {
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
  width: 100px;
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
