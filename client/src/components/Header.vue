<template>
  <div class="container text-center">
    <div class="row">
      <div class="col-12 top-banner">
        <img src="../assets/img/topbanner.png" />
        <div class="top-icons">
          <div class="icon user-container dropdown">
            <font-awesome-icon class="icon user" :icon="['fas', 'user']" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"/>
            <div class="user-menu">
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li v-if="!isLoggedIn" @click="register" class="dropdown-item">Đăng ký</li>
                <li v-if="!isLoggedIn" @click="login" class="dropdown-item">Đăng nhập</li>
                <li v-if="isLoggedIn" @click="logout" class="dropdown-item">Đăng xuất</li>
                <li v-if="isLoggedIn" @click="viewProfile" class="dropdown-item">Hồ sơ của tôi</li>
              </ul>
            </div>
          </div>
          
          <font-awesome-icon @click="goToCart" class="icon cart" :icon="['fas', 'cart-shopping']" />
          <font-awesome-icon class="icon heart" :icon="['fas', 'heart']" />
        </div>
      </div>
    </div>
    <div class="row">
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #225771;">
        <div class="container-fluid">
          <img class="navbar-brand" src="../assets/img/Logo.png" style="height: 40px; justify-self: center;" />
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/" class="nav-link" :class="{ 'text-pink': isActive === 'home' }" @click="isActive = 'home'">Trang chủ</router-link>
                <!-- <a class="nav-link" aria-current="page" href="#" :class="{ 'text-pink': isActive === 'home' }" @click="isActive = 'home'">Trang chủ</a> -->
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'text-pink': isActive === 'about' }" @click="isActive = 'about'">Giới thiệu</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                  :class="{ 'text-pink': isActive === 'category' }" @click="isActive = 'category'">Loại sách</a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown" style="background-color: #fff;">
                  <li><a class="dropdown-item" href="#">Tất cả</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#">Văn học</a></li>
                  <li><a class="dropdown-item" href="#">Kinh tế</a></li>
                  <li><a class="dropdown-item" href="#">Tiểu thuyết</a></li>
                  <li><a class="dropdown-item" href="#">Kỹ năng sống</a></li>
                  <li><a class="dropdown-item" href="#">Truyện thiếu nhi</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'text-pink': isActive === 'contact' }" @click="isActive = 'contact'">Liên hệ</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ 'text-pink': isActive === 'news' }" @click="isActive = 'news'">Tin tức</a>
              </li>
            </ul>
            <div class="header-search">
              <input 
                v-model="searchQuery" 
                @keyup.enter="handleSearch"
                class="header-search-input" 
                type="text" 
                placeholder="Tìm kiếm sách..."
              >
              <button @click="handleSearch" class="header-search-button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 100%;
  align-items: center;
  font-family: 'Jost', sans-serif;
}
.top-banner {
  position: relative;
  padding: 0;
}
.top-banner img {
  width: 100%;
  height: auto;
}

/* Định vị các biểu tượng trên banner */
.top-icons {
  position: absolute;
  top: 4px;
  right: 10px;
  display: flex;
  align-items: center;
}
.icon {
  color: #ffff;
  font-size: 24px;
  margin-left: 20px;
  cursor: pointer;
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  z-index: 1000;
}
.user-container:hover .dropdown-menu {
  display: block;
}
.user-menu ul li {
    list-style: none;
    padding: 10px;
    cursor: pointer;
    color: #225771;
    font-size: 16px;
}
.user-menu ul li:hover {
  background-color: #f5f5f5;
}

/* Navbar */
a {
  color: white;
}
.navbar-nav .nav-link {
  margin: auto 12px;
}
.text-pink {
  color: #FBA3CD !important;
  font-weight: bold;
}
.nav-link:hover {
  color: #FBA3CD;
}
.dropdown-item {
  color: #225771;
}

/* Header Search Styles */
.header-search {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 5px;
  margin-left: 15px;
}

.header-search-input {
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 14px;
  background: transparent;
  width: 200px;
  color: #333;
}

.header-search-input::placeholder {
  color: #999;
}

.header-search-button {
  background: #225771;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.header-search-button:hover {
  background: #1a4a5f;
}

/* Original button styles for other buttons */
button {
  border: 1.5px solid #fff;
  color: #fff;
  width: 96px;
}
button:hover {
  background-color: #f5c5dc;
  border: 1.5px solid #f5c5dc;
  color: #225771;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-brand {
    width: 90px;
    height: 30px;
  }
}
</style>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  data() {
    return {
      isActive: 'home', // Mặc định trang chủ được chọn
      isLoggedIn: false, // Mặc định người dùng chưa đăng nhập
      showUserMenu: false, // Trạng thái hiển thị menu user
      user: null,
      searchQuery: '',
    };
  },
  methods: {
    register() {
      this.$router.push("/register");
    },
    login() {
      this.$router.push("/login");
    },
    logout() {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.user = null;
      this.$router.push("/login");
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
        // Chuyển hướng đến trang chủ với query parameter
        this.$router.push({ path: '/', query: { search: this.searchQuery } });
      }
    },
    viewProfile() {
      try {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!this.isLoggedIn) {
          alert("Vui lòng đăng nhập trước khi xem hồ sơ!");
          return;
        }
        this.$router.push("/profile");
      } catch (error) {
        console.error('Có lỗi xảy ra khi chuyển tới trang hồ sơ:', error);
        alert("Lỗi khi chuyển đến trang hồ sơ.");
      }
    },
    goToCart() {
      this.$router.push("/cart");
    },
    checkLoginStatus() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.isLoggedIn = true;
      }
    },
  },
  mounted() {
    this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi trang web tải
  },
  watch: {
    // Khi người dùng chuyển trang, kiểm tra lại trạng thái đăng nhập
    $route(to, from) {
      this.checkLoginStatus();
    },
  },
};
</script>




