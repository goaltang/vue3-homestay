import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HouseDetail from "../views/HouseDetail.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { useAuthStore } from "@/stores/auth";
import OrderList from "../views/OrderList.vue";
import SearchResults from "../views/SearchResults.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/house/:id",
      name: "houseDetail",
      component: HouseDetail,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/orders",
      name: "orders",
      component: OrderList,
      meta: { requiresAuth: true },
    },
    {
      path: "/search",
      name: "search",
      component: SearchResults,
    },
    {
      path: "/admin",
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
      children: [
        {
          path: "",
          redirect: "/admin/dashboard",
        },
        {
          path: "dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
          meta: { title: "控制台" },
        },
        {
          path: "houses",
          component: () => import("../views/admin/HouseManageView.vue"),
          meta: { title: "房源管理" },
        },
        {
          path: "orders",
          component: () => import("../views/admin/OrderManageView.vue"),
          meta: { title: "订单管理" },
        },
        {
          path: "users",
          component: () => import("../views/admin/UserManageView.vue"),
          meta: { title: "用户管理" },
        },
      ],
    },
    {
      path: "/403",
      component: () => import("../views/403.vue"),
    },
  ],
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 如果没有用户信息，尝试恢复会话
  if (!authStore.user) {
    await authStore.checkAuth();
  }

  // 检查是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.user) {
      // 未登录，跳转到登录页
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      // 检查管理员权限
      if (
        to.matched.some((record) => record.meta.requiresAdmin) &&
        authStore.user.role !== "ADMIN"
      ) {
        next("/403");
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
