<template>
<div class="container">
  <div class="banner">
    <img src="../assets/img/banner.png" alt="banner" />
  </div>
  <div class="section">
    <div class="section-header">
      <h2>SÁCH TRONG THƯ VIỆN</h2>
      <div class="section-line"></div>
    </div>
    
    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch"
          @keyup.enter="performSearch"
          placeholder="Tìm kiếm sách theo tên, tác giả hoặc nhà xuất bản..."
          class="search-input"
        />
        <button @click="performSearch" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <button v-if="searchQuery" @click="clearSearch" class="clear-button">
        Xóa tìm kiếm
      </button>
    </div>
    
    <!-- Search Results Info -->
    <div v-if="searchQuery && books.length > 0" class="search-results-info">
      <p>Tìm thấy <strong>{{ books.length }}</strong> kết quả cho "<strong>{{ searchQuery }}</strong>"</p>
    </div>
    
    <div class="book-list" v-if="books && books.length">
      <div class="book-item" v-for="book in books" :key="book._id">
        <router-link :to="'/book/' + book._id">
          <img :src="book.chiTiet.hinhAnh[0]" :alt="book.tenSach">
        </router-link>
        <div class="book-title text-ellipsis">{{ book.tenSach }}</div>
        <div class="book-author">{{ book.tacGia }}</div>
        <div class="book-publisher">{{ book.nxbDetails.tenNXB }}</div>
        <div class="book-actions">
          <router-link :to="'/book/' + book._id" style="text-decoration: none;">
            <button class="borrow-button">XEM CHI TIẾT</button>
          </router-link>
          
        </div>
        
      </div>
    </div>
    <div v-else-if="searchQuery && books.length === 0" class="no-results">
      <p>Không tìm thấy sách nào phù hợp với "<strong>{{ searchQuery }}</strong>"</p>
      <p class="search-tips">Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả</p>
    </div>
    <div v-else-if="!searchQuery && books.length === 0" class="no-results">
      <p>Không có sách nào trong thư viện.</p>
    </div>
  </div>
</div>
</template>

<style scoped>
.container {
  padding: 0;
  margin: 0 auto;
  width: 100%;
  font-family: Roboto, sans-serif;
}

.banner {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0px;
  margin: 0px;
}

.banner img {
  max-width: 100%;
  width: 100%;
  height: auto;
}
h2 {
  color: #225771;
  padding: 12px 0;
  font-weight: bold;
}
.section {
  margin-bottom: 40px;
  position: relative;
}
.section-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  position: relative;
  padding-top: 12px; 
} 

.section-line { 
  flex-grow: 1; 
  height: 2px; 
  background-color: #225771; 
  margin: 0 16px; 
}

/* Search Styles */
.search-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  padding: 5px;
  flex: 1;
  max-width: 500px;
  transition: border-color 0.3s ease;
}

.search-box:focus-within {
  border-color: #225771;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 16px;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: #225771;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: #1a4a5f;
}

.clear-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.clear-button:hover {
  background: #d32f2f;
}

.book-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  
}
.book-item {
  width: 23%;
  background-color: #fff;
  
  border-radius: 5px;
  padding: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
}
.book-item img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.book-title {
  font-size: 16px;
  color: #34495e;
  margin: 8px 12px;
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap;
  font-weight: bold;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 4px 12px;
  font-style: italic;
}

.book-publisher {
  font-size: 12px;
  color: #888;
  margin: 4px 12px;
  margin-bottom: 8px;
}

/* Search Results Info */
.search-results-info {
  background: #e8f4fd;
  border: 1px solid #225771;
  border-radius: 8px;
  padding: 12px 20px;
  margin: 20px 0;
  text-align: center;
}

.search-results-info p {
  margin: 0;
  color: #225771;
  font-size: 16px;
}

.search-results-info strong {
  color: #1a4a5f;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-results p {
  margin: 10px 0;
  font-size: 16px;
}

.search-tips {
  font-size: 14px;
  color: #888;
  font-style: italic;
}
.book-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-icon {
  font-size: 28px;
  color: #225771;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.borrow-button {
  background: #225771;
  border-radius: 90px;
  color: #fff;
  border: none;
  padding: 8px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0;
}
.borrow-button:hover {
  background: #FFDCE2;
  color: #225771;
}
.cart-icon:hover {
  color: #FFDCE2;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .book-item {
    width: 48%;
  }
}

@media (max-width: 480px) {
  .book-item {
    width: 100%;
  }
}

</style>

<script>
import BookService from '@/services/BookService';
export default {
  name: "Home",
  data() {
    return {
      books: [],
      searchQuery: '',
      searchTimeout: null,
    };
  },

  created() {
    this.fetchBooks();
  },
  
  mounted() {
    // Set search query from URL if it exists
    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search;
    }
  },

  methods: {
    async fetchBooks() {
        const searchQuery = this.$route.query.search;
        try {
            let res;
            if (searchQuery) {
                res = await BookService.search(searchQuery);
            } else {
                res = await BookService.getAll();
            }
            this.books = res.data;
        } catch (err) {
            console.error("Lỗi khi lấy danh sách sách:", err);
            this.books = [];
        }
    },
    
    handleSearch() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      // Set new timeout for debounced search
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 500); // Wait 500ms after user stops typing
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ 
          query: { ...this.$route.query, search: this.searchQuery.trim() }
        });
      } else {
        this.clearSearch();
      }
    },
    
    clearSearch() {
      this.searchQuery = '';
      // Remove the search query parameter from URL
      const query = { ...this.$route.query };
      delete query.search;
      this.$router.push({ query });
    }
  },
  
  watch: {
    // Watch for route changes to update search results
    '$route.query.search': {
      handler() {
        this.fetchBooks();
      },
      immediate: true
    }
  }
}
</script>