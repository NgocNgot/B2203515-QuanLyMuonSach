<template>
<div class="admin-container">
  <!-- Navbar -->
  <aside class="sidebar">
    <nav>
      <ul>
        <li>
          <router-link to="/admins/books">
            <font-awesome-icon :icon="['fas', 'book']" />
            Sách</router-link>
        </li>

        <li>
          <router-link to="/admins/users">
            <font-awesome-icon :icon="['fas', 'book-open-reader']" />
            Độc giả</router-link>
        </li>

        <li>
          <router-link to="/admins/borrows">
            <font-awesome-icon :icon="['fas', 'file-lines']" />
            Mượn trả</router-link>
        </li>
        <li>
          <router-link to="/admins/nxbs">
            <font-awesome-icon :icon="['fas', 'gear']" />
            Nhà XB</router-link>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Main content -->
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
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.admin-container {
  display: flex;
  font-family: 'Jost', sans-serif;
  overflow: hidden;
  margin: 0;
}

.sidebar {
  width: 160px;
  background-color: #225771;
  padding: 20px;
  
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
}
.content {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}
</style>
