import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Register from "@/views/Register.vue"
import AdminLayout from "@/components/AdminLayout.vue";
import ManageBook from "@/views/ManageBook.vue";
import ManageUser from "@/views/ManageUser.vue";
import ManageBorrow from "@/views/ManageBorrow.vue";
import ManageNXB from "@/views/ManageNXB.vue";
import BookDetail from "@/views/BookDetail.vue";
import Profile from "@/views/Profile.vue";
import BorrowBook from "@/views/BorrowBook.vue";
import Cart from "@/views/Cart.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: '/book/:id',  // Route cho trang chi tiết sách
      name: 'BookDetail',
      component: BookDetail,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: '/cart',  // Route cho trang chi tiết sách
      name: 'Cart',
      component: Cart,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: "/borrow",
      name: "BorrowBook",
      component: BorrowBook,
      meta: { showHeader: true, showFooter: true },
    },
    {
      path: "/admins",
      component: AdminLayout, // Bố cục riêng cho trang admin
      meta: { showHeader: true, showFooter: false },
      children: [
      {
        path: "books",
        name: "ManageBook",
        component: ManageBook,
      },
      {
        path: "users",
        name: "ManageUser",
        component: ManageUser,
      },
      {
        path: "borrows",
        name: "ManageBorrow",
        component: ManageBorrow,
      },
      {
        path: "nxbs",
        name: "ManageNXB",
        component: ManageNXB,
      },
    ],
    },

  ]
})

export default router