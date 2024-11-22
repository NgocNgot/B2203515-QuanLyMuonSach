<template>
<div class="container borrow-book">
  <h2 class="text-center">ĐĂNG KÝ MƯỢN SÁCH</h2>

  <div class="row reader-info" v-if="readerInfo">
    <div class="col-sm">
      <p><strong>Họ tên:</strong> {{ readerInfo.hoLot }} {{ readerInfo.ten }}</p>
    </div>
    <div class="col-sm">
      <p><strong>Mã độc giả:</strong> {{ readerInfo.maDocGia }}</p>
    </div>
  </div>
  <div v-else class="row">
    <div class="col">
      <p>Không tìm thấy thông tin độc giả.</p>
    </div>
  </div>

  <div class="row borrow-dates">
    <div class="col-sm">
      <p><strong>Ngày mượn:</strong> {{ currentDate }}</p>
    </div>
    <div class="col-sm d-flex align-items-center">
      <label for="ngayTra">Ngày trả:</label>
      <input type="date" id="ngayTra" v-model="ngayTra" class="form-control" />
    </div>
  </div>

  <div class="row book-info" v-if="books.length > 0">
    <div class="col">
      <p><strong>Danh sách mượn:</strong></p>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" :key="index">
            <td>{{ book.maSach }}</td>
            <td>{{ book.tenSach }}</td>
            <td>{{ book.tacGia }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <button @click="registerBorrow" :disabled="books.length === 0 || !readerInfo" class="btn btn-primary w-100">
        ĐĂNG KÝ MƯỢN SÁCH
      </button>
    </div>
  </div>
</div>
</template>

<script>
import BorrowService from '@/services/BorrowService';

export default {
  name: 'BorrowBook',
  data() {
    return {
      // Lấy thông tin độc giả từ localStorage
      readerInfo: this.getReaderInfo(),
      books: [],
      // Ngày mượn là ngày hiện tại
      currentDate: this.formatDate(new Date()),
      ngayTra: '',  // Người dùng chọn ngày trả
    };
  },
  created() {
    // Kiểm tra nếu dữ liệu đến từ trang chi tiết sách
    if (this.$route.query.from === 'BookDetail') {
      this.books = [{
        maSach: this.$route.query.maSach,
        tenSach: this.$route.query.tenSach,
        tacGia: this.$route.query.tacGia,
      }];
      this.currentDate = this.$route.query.ngayMuon; // Ngày mượn từ query parameters
    } else {
      // Nếu không, lấy dữ liệu từ giỏ hàng
      this.books = this.$route.query.books ? JSON.parse(this.$route.query.books) : [];
      this.currentDate = this.formatDate(new Date()); // Ngày mượn là ngày hiện tại
    }
  },

  methods: {
    // Lấy thông tin độc giả từ localStorage
    getReaderInfo() {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData?.data ? {
          maDocGia: parsedData.data.maDocGia,
          hoLot: parsedData.data.hoLot,
          ten: parsedData.data.ten,
        } : null;
      }
      return null;
    },

    // Định dạng lại ngày cho đúng chuẩn (YYYY-MM-DD)
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },


    // Đăng ký mượn sách
    async registerBorrow() {
      if (!Array.isArray(this.books) || this.books.length === 0) {
        alert('Giỏ hàng của bạn hiện không có sách để mượn!');
        return;
      }

      // Kiểm tra người dùng đã chọn ngày trả chưa
      if (!this.ngayTra) {
        alert('Vui lòng chọn ngày trả!');
        return;
      }

      // Tạo phiếu mượn cho tất cả các sách trong giỏ hàng
      const borrowData = this.books.map(item => ({
        maDocGia: this.readerInfo.maDocGia,
        maSach: item.maSach,
        tenSach: item.tenSach,
        ngayMuon: this.formatDate(this.currentDate),
        ngayTra: this.formatDate(this.ngayTra),
        trangThai: 'Chờ xác nhận', // Thiết lập trạng thái mặc định
      }));

      // In dữ liệu gửi đi để kiểm tra
      console.log("Dữ liệu gửi đi:", borrowData);
      try {
        // Gọi API để tạo nhiều phiếu mượn
        await BorrowService.create(borrowData);
        // Xóa giỏ hàng sau khi đăng ký mượn sách thành công
        localStorage.removeItem('cart');
        alert('Đăng ký mượn sách thành công!');
        this.$router.push('/');
      } catch (error) {
        console.error('Lỗi khi đăng ký mượn sách:', error);
        alert('Có lỗi xảy ra trong quá trình mượn sách.');
      }
    }
  },
};
</script>

<style scoped>
.borrow-book {
  width: 60%;
  margin: 12px auto;
  padding: 20px 40px;
  background-color: #ffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.borrow-book h2 {
  text-align: center;
  color: #225771;
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
}

.book-info h3 {
  color: #225771;
  margin-bottom: 10px;

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
.borrow-dates input {
  padding: 8px 10px;
  margin-left: 12px;
  border: 1px solid #225771;
  border-radius: 4px;
  height: 40px;
  width: 60%;
}
button {
  width: 100%;
  padding: 10px;
  margin: 12px auto;
  background: #225771;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #FFDCE2;
  color: #225771;
}

</style>
