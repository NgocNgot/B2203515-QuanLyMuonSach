<template>
  <div class="cart-container">
    <h2>Giỏ hàng</h2>
    <table v-if="cart.length" class="cart-table">
      <thead>
        <tr>
          <th>Mã sách</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ item.maSach }}</td>
          <td>{{ item.tenSach }}</td>
          <td>{{ item.tacGia }}</td>
          <td>
            <button @click="removeFromCart(index)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Giỏ hàng của bạn trống.</p>
    <button v-if="cart.length" @click="proceedToCheckout">LẬP PHIẾU MƯỢN SÁCH</button>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [], // Giỏ hàng từ localStorage
    };
  },
  methods: {
    removeFromCart(index) {
      this.cart.splice(index, 1); // Xóa sách khỏi giỏ hàng
      localStorage.setItem('cart', JSON.stringify(this.cart)); // Cập nhật lại localStorage
    },
    proceedToCheckout() {
      // Kiểm tra nếu giỏ hàng trống
      if (this.cart.length === 0) {
        alert('Giỏ hàng của bạn trống!');
        return;
      }

      // Tạo danh sách các sách mượn
      const booksToBorrow = this.cart.map(book => ({
        maSach: book.maSach,
        tenSach: book.tenSach,
        tacGia: book.tacGia,
      }));

      // Chuyển đến trang BorrowBook và truyền thông tin qua query params
      this.$router.push({
        name: 'BorrowBook',
        query: {
          books: JSON.stringify(booksToBorrow), // Truyền giỏ hàng như một chuỗi JSON
          from: 'Cart'
        },
      });
    },
  },
};
</script>
<style>
/* Giỏ hàng */
.cart-container {
  width: 60%;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-container h2 {
  text-align: center;
  color: #225771;
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th, .cart-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.cart-table th {
  background-color: #225771;
  color: white;
}

.cart-table button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.cart-table button:hover {
  background-color: #c0392b;
}

.cart-container p {
  text-align: center;
  color: #888;
  font-size: 16px;
}

.cart-container button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #225771;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.cart-container button:hover {
  background-color: #FFDCE2;
  color: #225771;
}

</style>