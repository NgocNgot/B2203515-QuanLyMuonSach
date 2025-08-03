<template>
  <div class="admin-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h6 v-if="!isSidebarCollapsed">
          <router-link to="/"> <img src="@/assets/img/Logo.png" alt="Admin Logo" class="navbar-brand"
              style="height: 25px;">
          </router-link>
        </h6>
        <button @click="toggleSidebar" class="toggle-button">
          <font-awesome-icon :icon="['fas', isSidebarCollapsed ? 'chevron-right' : 'chevron-left']" />
        </button>
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/admins/books">
              <font-awesome-icon :icon="['fas', 'book']" />
              <span v-if="!isSidebarCollapsed">Sách</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admins/users">
              <font-awesome-icon :icon="['fas', 'book-open-reader']" />
              <span v-if="!isSidebarCollapsed">Độc giả</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admins/borrows">
              <font-awesome-icon :icon="['fas', 'file-lines']" />
              <span v-if="!isSidebarCollapsed">Mượn trả</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admins/nxbs">
              <font-awesome-icon :icon="['fas', 'gear']" />
              <span v-if="!isSidebarCollapsed">Nhà XB</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminLayout",
  data() {
    return {
      isSidebarCollapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
};
</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
}

.sidebar-header {
  text-align: flex-start;
  color: #fff;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-container {
  display: flex;
  font-family: 'Jost', sans-serif;
  overflow-x: auto;
  margin: 0;
}

.sidebar {
  width: 160px;
  background-color: #225771;
  padding: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
}

.admin-container.sidebar-collapsed .sidebar {
  width: 50px;
  padding: 20px 10px;
}

.toggle-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 25px;
  cursor: pointer;
  padding: 0;
}

.admin-container.sidebar-collapsed .toggle-button {
  position: absolute;
  top: 10px;
  right: 20px
}

.admin-container.sidebar-collapsed .sidebar-header h6 {
  display: none;
}

.admin-container.sidebar-collapsed .sidebar-header {
  margin: 20px;
}

.admin-container.sidebar-collapsed .sidebar nav ul li a {
  justify-content: center;
  padding: 1rem;
}

.admin-container.sidebar-collapsed .sidebar nav ul li a span {
  display: none;
}

.sidebar nav ul li a.router-link-exact-active {
  background-color: #f5c5dc;
  color: #225771;
}

.sidebar nav ul li {
  list-style: none;
  padding: 0;
  position: relative;
  margin-bottom: 10px;
}

.sidebar nav ul li a {
  display: flex;
  align-items: center;
  color: #ecf0f1;
  gap: 8px;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.sidebar nav ul li a:hover {
  background-color: #FFDCE2;
  color: #225771;
}

/* Main content styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-left: 160px;
  /* Adjust based on sidebar width */
  transition: margin-left 0.3s ease;
}

.content {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.admin-container.sidebar-collapsed .main-content {
  margin-left: 50px;
  /* Adjust based on collapsed sidebar width */
}
</style>
