<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

const isAdmin = computed(() => {
  return authStore.user?.role === "ADMIN";
});
</script>

<template>
  <nav class="nav-bar">
    <div class="nav-left">
      <router-link to="/" class="logo">
        民宿预订
      </router-link>
    </div>
    <div class="nav-right">
      <template v-if="authStore.user">
        <router-link to="/orders" class="nav-item">我的订单</router-link>
        <router-link v-if="isAdmin" to="/admin" class="nav-item">后台管理</router-link>
        <div class="user-menu">
          <img :src="authStore.user.avatar" :alt="authStore.user.username" class="avatar">
          <div class="dropdown-menu">
            <span class="username">{{ authStore.user.username }}</span>
            <button class="logout-btn" @click="authStore.logout">退出登录</button>
          </div>
        </div>
      </template>
      <router-link v-else to="/login" class="nav-item">登录</router-link>
    </div>
  </nav>

  <router-view />
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background: #f5f5f5;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  min-width: 150px;
  display: none;
}

.user-menu:hover .dropdown-menu {
  display: block;
}

.username {
  display: block;
  padding: 5px 10px;
  color: #666;
  font-size: 0.9em;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.logout-btn {
  width: 100%;
  padding: 8px;
  border: none;
  background: none;
  color: #e74c3c;
  cursor: pointer;
  text-align: left;
  font-size: 0.9em;
}

.logout-btn:hover {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .nav-bar {
    padding: 10px 15px;
  }

  .nav-item {
    padding: 6px 12px;
  }
}
</style>
