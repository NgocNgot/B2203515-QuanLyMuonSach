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
            <label for="tenSach">Tên Sách: <span class="required">*</span></label>
            <input 
              v-model="currentBook.tenSach" 
              type="text" 
              id="tenSach" 
              :class="{ 'error': errors.tenSach }"
              @blur="validateField('tenSach')"
              @input="checkDuplicateOnInput"
              required 
            />
            <span v-if="errors.tenSach" class="error-message">{{ errors.tenSach }}</span>
          </div>
          <div class="col-sm">
            <label for="loaiSach">Loại Sách: <span class="required">*</span></label>
            <select 
              v-model="currentBook.loaiSach" 
              id="loaiSach" 
              :class="{ 'error': errors.loaiSach }"
              @change="validateField('loaiSach')"
              required
            >
              <option value="">Chọn thể loại sách</option>
              <option value="Văn học">Văn học</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Tiểu thuyết">Tiểu thuyết</option>
              <option value="Kỹ năng sống">Kỹ năng sống</option>
              <option value="Truyện thiếu nhi">Truyện thiếu nhi</option>
            </select>
            <span v-if="errors.loaiSach" class="error-message">{{ errors.loaiSach }}</span>
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="tacGia">Tác giả: <span class="required">*</span></label>
            <input 
              v-model="currentBook.tacGia" 
              type="text" 
              id="tacGia" 
              :class="{ 'error': errors.tacGia }"
              @blur="validateField('tacGia')"
              @input="checkDuplicateOnInput"
              required 
            />
            <span v-if="errors.tacGia" class="error-message">{{ errors.tacGia }}</span>
          </div>
          <div class="col-sm">
            <label for="tenNXB">Tên NXB: <span class="required">*</span></label>
            <input 
              v-model="currentBook.tenNXB" 
              type="text" 
              id="tenNXB" 
              :class="{ 'error': errors.tenNXB }"
              @blur="validateField('tenNXB')"
              required 
            />
            <span v-if="errors.tenNXB" class="error-message">{{ errors.tenNXB }}</span>
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="namXuatBan">Năm xuất bản: <span class="required">*</span></label>
            <input 
              v-model="currentBook.namXuatBan" 
              type="number" 
              id="namXuatBan" 
              :class="{ 'error': errors.namXuatBan }"
              @blur="validateField('namXuatBan')"
              min="1900" 
              :max="new Date().getFullYear() + 1"
              required 
            />
            <span v-if="errors.namXuatBan" class="error-message">{{ errors.namXuatBan }}</span>
          </div>
          <div class="col-sm">
            <label for="donGia">Đơn giá (VNĐ): <span class="required">*</span></label>
            <input 
              v-model="currentBook.donGia" 
              type="number" 
              id="donGia" 
              :class="{ 'error': errors.donGia }"
              @blur="validateField('donGia')"
              min="0" 
              max="10000000"
              step="100"
              required 
            />
            <span v-if="errors.donGia" class="error-message">{{ errors.donGia }}</span>
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="soQuyen">Số quyển: <span class="required">*</span></label>
            <input 
              v-model="currentBook.soQuyen" 
              type="number" 
              id="soQuyen" 
              :class="{ 'error': errors.soQuyen }"
              @blur="validateField('soQuyen')"
              min="1" 
              max="1000"
              required 
            />
            <span v-if="errors.soQuyen" class="error-message">{{ errors.soQuyen }}</span>
          </div>
          <div class="col-sm">
            <label for="hinhAnh">Hình ảnh (URL):</label>
            <input 
              v-model="currentBook.chiTiet.hinhAnh" 
              type="url" 
              id="hinhAnh" 
              :class="{ 'error': errors['chiTiet.hinhAnh'] }"
              @blur="validateField('chiTiet.hinhAnh')"
              placeholder="https://example.com/image.jpg"
            />
            <span v-if="errors['chiTiet.hinhAnh']" class="error-message">{{ errors['chiTiet.hinhAnh'] }}</span>
          </div>
        </div>

        <div class="row">
          <div class="col-sm">
            <label for="moTa">Mô tả:</label>
            <textarea 
              v-model="currentBook.chiTiet.moTa" 
              id="moTa" 
              :class="{ 'error': errors['chiTiet.moTa'] }"
              @blur="validateField('chiTiet.moTa')"
              @input="validateField('chiTiet.moTa')"
              maxlength="1000"
              rows="3"
              placeholder="Mô tả về sách..."
            ></textarea>
            <div class="field-info">
              <span v-if="errors['chiTiet.moTa']" class="error-message">{{ errors['chiTiet.moTa'] }}</span>
              <span class="char-count">{{ currentBook.chiTiet.moTa ? currentBook.chiTiet.moTa.length : 0 }}/1000 ký tự</span>
            </div>
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
import BookService from "@/services/BookService";
import BookValidation from "@/utils/validation.js";
import axios from "axios";
import { reactive } from 'vue';

export default {
  data() {
    return {
      books: [],
      isModalOpen: false,
      modalType: "add", // 'add' hoặc 'edit'
      currentBook: {
        tenSach: "",
        loaiSach: "",
        tacGia: "",
        namXuatBan: "",
        donGia: "",
        soQuyen: "",
        tenNXB: "",
        chiTiet: {
          hinhAnh: "",
          moTa: "",
        },
      },
      errors: reactive({}),
      isFormValid: false,
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
      this.clearErrors();
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
      this.clearErrors();
      this.isModalOpen = true;
    },
    async validateField(fieldName) {
      const value = BookValidation.getNestedValue(this.currentBook, fieldName);
      const validation = await BookValidation.validateField(fieldName, value, this.currentBook);
      
      if (validation.isValid) {
        delete this.errors[fieldName];
      } else {
        this.errors[fieldName] = validation.message;
      }
      
      this.updateFormValidity();
    },
    
    async validateAllFields() {
      const validation = await BookValidation.validateAll(this.currentBook);
      this.errors = validation.errors;
      this.isFormValid = validation.isValid;
    },
    
    async updateFormValidity() {
      const validation = await BookValidation.validateAll(this.currentBook);
      this.isFormValid = validation.isValid;
    },
    
    clearErrors() {
      Object.keys(this.errors).forEach(key => {
        delete this.errors[key];
      });
      this.isFormValid = false;
    },

    // Debounce function để tránh gọi API quá nhiều
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Kiểm tra trùng lặp khi người dùng nhập
    checkDuplicateOnInput: function() {
      this.debouncedCheckDuplicate();
    },

    // Method thực tế để kiểm tra trùng lặp
    async performDuplicateCheck() {
      if (this.currentBook.tenSach && this.currentBook.tenSach.trim() && 
          this.currentBook.tacGia && this.currentBook.tacGia.trim()) {
        await this.validateField('tenSach');
      }
    },
    
    async handleSubmit() {
      await this.validateAllFields();
      
      if (!this.isFormValid) {
        // Show validation errors in the form instead of alert
        console.log('Form has validation errors:', this.errors);
        return;
      }
      
      try {
        // Sanitize data before submission
        const bookData = BookValidation.sanitizeData(this.currentBook);
        console.log('Submitting book data:', bookData);
        
        if (this.modalType === "add") {
          console.log('Creating new book...');
          const response = await BookService.create(bookData);
          console.log('Create response:', response);
          if (response.message) {
            alert(response.message);
          } else {
            alert("Thêm sách thành công!");
          }
          
          // Hiển thị thông báo nếu NXB được tạo tự động
          if (response.data && response.data.nxbCreated) {
            alert(`Đã tự động tạo nhà xuất bản mới: ${response.data.nxbCreated.tenNXB} (${response.data.nxbCreated.maNXB})`);
          }
        } else {
          console.log('Updating book...');
          const response = await BookService.update(this.currentBook._id, bookData);
          console.log('Update response:', response);
          if (response.message) {
            alert(response.message);
          } else {
            alert("Sửa sách thành công!");
          }
        }
        this.closeModal();
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi lưu sách:", error);
        
        // Handle validation errors from backend
        if (error.response && error.response.data && error.response.data.errors) {
          const backendErrors = error.response.data.errors;
          if (Array.isArray(backendErrors)) {
            alert('Lỗi validation:\n' + backendErrors.join('\n'));
          } else {
            alert('Lỗi: ' + error.response.data.message);
          }
        } else if (error.response && error.response.data && error.response.data.message) {
          alert('Lỗi: ' + error.response.data.message);
        } else {
          alert("Có lỗi khi lưu sách!");
        }
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
          alert("Có lỗi khi xóa sách!");
        }
      }
    },
    
    closeModal() {
      this.isModalOpen = false;
      this.resetCurrentBook();
      this.clearErrors();
    },
    
    resetCurrentBook() {
      this.currentBook = {
        tenSach: "",
        loaiSach: "",
        tacGia: "",
        namXuatBan: "",
        donGia: "",
        soQuyen: "",
        tenNXB: "",
        chiTiet: {
          hinhAnh: "",
          moTa: "",
        },
      };
    },
  },
  mounted() {
    this.fetchBooks();
    // Khởi tạo debounced function
    this.debouncedCheckDuplicate = this.debounce(this.performDuplicateCheck, 500);
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
   width: 40%;
   max-width: 500px;
   min-width: 400px;
 }
.title {
  color: #225771;
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
}
 .form-field {
   margin-bottom: 16px;
 }
 
 .form-field label {
   display: block;
   margin-bottom: 4px;
   color: #000;
   font-weight: 500;
 }
 
 .form-field input, 
 .form-field select {
   width: 100%;
   height: 40px;
   padding: 10px;
   background-color: #F1F1F1;
   border-radius: 5px;
   border: 1px solid #ddd;
   transition: border-color 0.3s ease;
   box-sizing: border-box;
 }
 
 .form-field input:focus, 
 .form-field select:focus {
   outline: none;
   border-color: #225771;
   background-color: #fff;
 }
 
 .form-field input.error, 
 .form-field select.error {
   border-color: #dc3545;
   background-color: #fff5f5;
 }
 
 .form-field textarea {
   width: 100%;
   padding: 10px;
   background-color: #F1F1F1;
   border-radius: 5px;
   border: 1px solid #ddd;
   resize: vertical;
   min-height: 80px;
   transition: border-color 0.3s ease;
   box-sizing: border-box;
 }
 
 .form-field textarea:focus {
   outline: none;
   border-color: #225771;
   background-color: #fff;
 }
 
 .form-field textarea.error {
   border-color: #dc3545;
   background-color: #fff5f5;
 }
 
 .required {
   color: #dc3545;
   font-weight: bold;
 }
 
 .error-message {
   color: #dc3545;
   font-size: 12px;
   margin-top: 4px;
   display: block;
 }
 
 .form-actions {
   display: flex;
   gap: 12px;
   margin-top: 24px;
   justify-content: center;
 }
 
 .form-actions button {
   width: 120px;
   height: 40px;
   padding: 8px 16px;
   background: #225771;
   color: #fff;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   transition: all 0.3s ease;
   font-size: 14px;
   font-weight: 500;
 }
 
 .form-actions button:hover:not(:disabled) {
   background: #FFDCE2;
   color: #225771;
 }
 
   .form-actions button:disabled {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  /* Row and column layout */
  .row {
    display: flex;
    margin-bottom: 16px;
    gap: 16px;
  }

  .col-sm {
    flex: 1;
  }

  .col-sm label {
    display: block;
    margin-bottom: 4px;
    color: #000;
    font-weight: 500;
  }

  .col-sm input,
  .col-sm select,
  .col-sm textarea {
    width: 100%;
    height: 40px;
    padding: 10px;
    background-color: #F1F1F1;
    border-radius: 5px;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }

  .col-sm input:focus,
  .col-sm select:focus,
  .col-sm textarea:focus {
    outline: none;
    border-color: #225771;
    background-color: #fff;
  }

  .col-sm input.error,
  .col-sm select.error,
  .col-sm textarea.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }

  .col-sm textarea {
    height: auto;
    min-height: 80px;
    resize: vertical;
  }

  .col-sm button {
    width: 120px;
    height: 40px;
    padding: 8px 16px;
    background: #225771;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 500;
    margin-right: 12px;
  }

  .col-sm button:hover:not(:disabled) {
    background: #FFDCE2;
    color: #225771;
  }

   .col-sm button:last-child {
   margin-right: 0;
 }

 .field-info {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: 4px;
 }

 .char-count {
   font-size: 12px;
   color: #666;
   text-align: right;
 }

 .error-message {
   color: #dc3545;
   font-size: 12px;
   margin-top: 4px;
   display: block;
 }


</style>
