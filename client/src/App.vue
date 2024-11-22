<script>
  import { computed } from "vue";
  import { useRoute } from "vue-router"; 
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue';
  export default {
    components: {
      Header,
      Footer,
    },
    setup() {
      const route = useRoute();
      const showHeader = computed(() => route.meta.showHeader);
      const showFooter = computed(() => route.meta.showFooter);

      return {
        showHeader,
        showFooter,
      };
    },
  };
</script>

<template>
  <div class="app-container">
    <Header v-if="showHeader"/>
    <RouterView/>
    <Footer v-if="showFooter"/>
  </div>
</template>

<style>
.app-container {
  max-width: 1280px;
  margin: 0 auto; /* Căn giữa trang */
  padding: 0;
  width: 100%; /* Đảm bảo trang bao phủ toàn bộ chiều rộng */
}

@media (max-width: 768px) {
  .app-container {
    padding: 0 10px; /* Điều chỉnh padding cho màn hình nhỏ */
  }
}
</style>