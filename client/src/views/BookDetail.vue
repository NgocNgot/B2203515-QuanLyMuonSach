<template>
<div class="container">
  <div class="book-detail" v-if="book">
      <div class="book-detail-left">
          <img
              v-if="book.chiTiet.hinhAnh && book.chiTiet.hinhAnh.length"
              :src="book.chiTiet.hinhAnh[selectedThumbnail]"
              alt="Ảnh sách"
              class="book-cover"
          />
          <div class="book-thumbnails">
              <img
                  v-for="(thumb, index) in book.chiTiet.hinhAnh"
                  :src="thumb"
                  :key="index"
                  alt="Thumbnail"
                  class="thumbnail"
                  :class="{ active: selectedThumbnail === index }"
                  @click="changeBookCover(index)"
              />
          </div>
      </div>
      <div class="book-detail-right">
          <h2 class="book-title">{{ book.tenSach || "Đang tải..." }}</h2>
          <div class="row">
              <p class="col-sm"><strong>Mã sách:</strong> {{ book.maSach || "Chưa cập nhật" }}</p>
              <p class="col-sm"><strong>Tác giả:</strong> {{ book.tacGia || "Chưa cập nhật" }}</p>
          </div>
          <div class="row">
              <p class="col-sm"><strong>Nhà xuất bản:</strong> {{ book.nxbDetails.tenNXB || "Chưa cập nhật" }}</p>
              <p class="col-sm"><strong>Năm xuất bản:</strong> {{ book.namXuatBan || "Chưa cập nhật" }}</p>
          </div>
            <div class="row">
              <p class="col-sm"><strong>Trạng thái:</strong> {{ book.trangThai || "Chưa cập nhật" }}</p>
          </div>
          
          <div class="book-actions">
              <button class="add-to-cart" @click="addToCart">
                  <font-awesome-icon :icon="['fas', 'cart-shopping']" />
              </button>
              <button class="borrow-button" @click="goToBorrowBook(book)">MƯỢN NGAY</button>
          </div>

          <p><strong>Nội dung:</strong><br> {{ book.chiTiet.moTa || "Chưa cập nhật" }}</p>
      </div>
  </div>
  <div v-else>
      <p>Loading...</p>
  </div>
</div>

</template>

<script>
import BookService from '@/services/BookService';
export default {
  name: 'BookDetail',
  data() {
      return {
          book: {
            maSach: "",
            tenSach: "",
            tacGia: "",
            namXuatBan: "",
            tenNXB: "",
              chiTiet: {
                  hinhAnh: [],
              },
          },
          selectedThumbnail: 0,
      };
  },
  created() {
      const bookId = this.$route.params.id;
      if (bookId) {
          this.fetchBook(bookId);
      } else {
          console.error("Không có ID sách trong route params.");
      }
  },


  methods: {
    fetchBook(id) {
        BookService.get(id)
        .then((data) => {
            console.log("Dữ liệu sách:", data);
            this.book = data; // Dữ liệu sách được gán đúng
        })
        .catch((err) => {
            console.error("Lỗi khi lấy thông tin sách:", err);
            this.book = null;
        });
    },
    changeBookCover(index) {
        this.selectedThumbnail = index;
    },
    addToCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Kiểm tra xem sách đã có trong giỏ hàng chưa
      const bookIndex = cart.findIndex(item => item.maSach === this.book.maSach);
      if (bookIndex === -1) {
        // Nếu chưa có thì thêm vào giỏ hàng
        cart.push({
          maSach: this.book.maSach,
          tenSach: this.book.tenSach,
          tacGia: this.book.tacGia,
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm sách vào giỏ hàng');
      } else {
        alert('Sách này đã có trong giỏ hàng');
      }
    },


    goToBorrowBook(book) {
      const readerInfo = JSON.parse(localStorage.getItem('user'))?.data || {};
      this.$router.push({
        name: 'BorrowBook',
        query: {
          maDocGia: readerInfo.maDocGia, 
          maSach: book.maSach, 
          tenSach: book.tenSach, 
          tacGia: book.tacGia, 
          ngayMuon: new Date().toISOString().substring(0, 10),
          from: 'BookDetail'
        },
      });
    },
  },
};
</script>

<style scoped>
.book-detail {
  display: flex;
  gap: 20px;
  margin: 40px 0;
  background-color: #fff;
  font-family: Roboto, sans-serif;
}

.book-detail-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-thumbnails {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

.thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.thumbnail.active {
  border: 2px solid #225771;
  transform: scale(1.1);
}

.thumbnail:hover {
  transform: scale(1.1);
}
.book-cover {
  width: 300px;
  height: auto;
}

.book-detail-right {
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.book-title {
  font-size: 36px;
  color: #225771;
  font-weight: bold;
  margin-bottom: 16px;
}

.book-detail-right p {
  font-size: 16px;
  color: #000;
  white-space: pre-line; /* Giữ lại các ký tự xuống dòng và khoảng cách */
}
.row {
  display: flex;
  margin-bottom: 4px;
}

.col-sm {
  flex: 1;
  margin-right: 8px;
}

.col-sm:last-child {
  margin-right: 0;
}
.book-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.add-to-cart,
.borrow-button {
  background-color: #225771;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 60px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
button:hover {
  background-color: #FFDCE2;
  color: #225771;
}

</style>